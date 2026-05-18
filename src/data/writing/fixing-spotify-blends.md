---
author: Tyler Holewinski
pubDatetime: 2026-05-17T03:52:58.281Z
title: Fixing Spotify Blends
slug: fixing-spotify-blends
featured: true
draft: false
description: In which I judge and impose my will upon the engineers who build Spotify Blends
---

A couple weeks ago, my girlfriend asked to make a Spotify blend with me. I was so excited to see that Spotify gave us a "93%" compatibility score (cute), but when I looked at the blend itself I was quite disappointed. Spotify seemed to try to split the playlist into thirds- one third was music I listened to. One third music she listened to. And the final third being music we **both** listen to. However, even then there was a catch.

Often it would show a song one of us liked by an _artist_ the other liked. Now this, is cool and nifty and I see _why_ they structured it this way (that's actually a lie to appear as a kind, polite person. The truth is I think this decision is honestly pretty stupid but whatever).

Anyway...

## I Want a Playlist of **Our** Top Songs

It shouldn't be that complex- a playlist of 100 songs that we **both** enjoy. Now, there's another wrinkle with this. Music can be somewhat "functional" for me sometimes. What this means is I listen to a lot of music not because I _love_ it per-se, but rather because it serves a _function_. For example, I have a sleeping playlist. It's the same like, 8 songs. I listen to it every night before bed and _only_ before bed, and it knocks me out. Now, sometimes I forget to set my sleep timer on Spotify and now all of a sudden Spotify thinks this sleeping song for me is a new hit.

Further, sometimes I literally just have an earworm and need to listen to a specific song on repeat for a day, and then it passes. Instances like this I've found to really pollute the blend.

## My Solution To This Problem

Assume we have a collection of "listens", each with a day. To calculate a "score" for a given song in a given time range, we employ roughly the following algorithm:

```ts
function computeScore(songId: string, userId: string) {
  function startOfDay(d: Date) {
    const ret = new Date(d);
    ret.setHours(0, 0, 0, 0);
    return ret;
  }

  const listens = getListensBySongId(songId, userId, 6 * Time.months);
  const grouped = new Map();

  // bucket together any "listen" that happened on the same day
  for (const each of listens) {
    const k = startOfDay(each.ts).getTime();
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(each);
  }

  // our score is the sum of each "bucket"'s natural log
  // this gives much greater bias towards listening to a song for multiple
  // days, rather than multiple *times* in the same day, in which case the
  // score only increases logarithmically, rather than linearly with the
  // per-day listen count
  return [...grouped.values()].reduce(
    (score, group) => score + Math.log(group.length) + 1, // we add 1 since ln1 is 0 and listening to the song at least once per day should yield a high reward
    0, // initial score
  );
}
```

## Creating the Blend

With a solid scoring mechanism under our belts, creating the blend itself should be fairly straightforward. We just start with the pool of _all_ songs for every user in the blend, and compute a score for each being equal to the minimum value of that song for each user. This means if User A never listened to it, their score would be `0`, which means the score would be `0` for the entire blend. This effectively eliminates the song from candidacy. Also, if one person _really_ likes the song, it doesn't really matter as much (this is the case we talked about earlier where only one person is really into the song, and the other person might be vaguely familiar since they listened to a similar artist). Every member of the blend must have a non-zero score for the song's candidacy to be considered.

```ts
function blend(userIds: string[], size = 100) {
  // step 1: build a "candidate" list of every possible song in the playlist.
  // this is just every song each of the users has listened to

  const candidates = new Set<string>();
  for (const uid of userIds) {
    for (const sid of getListenedSongsByUserId(uid, 6 * Time.months)) {
      candidates.add(sid);
    }
  }

  // step 2: score them
  const scored: { sid: string; score: number }[] = [];

  for (const sid of candidates) {
    const scores = userIds.map((uid) => computeScore(sid, uid));

    // drop any candidate where some user hasn't listened to it at all (score of 0)
    if (scores.some((s) => s == 0)) continue;

    // the lowest score is kept as the "blend score". this fixes the issue of one person
    // really liking a song without the other person being into it too
    scored.push({ sid, score: Math.min(...scores) });
  }

  // step 3: just take the top N
  return scored
    .toSorted((a, b) => b.score - a.score)
    .slice(0, size)
    .map(({ sid }) => sid);
}
```

> This of course is implemented in typescript largely as an example. I would be laughed at if I didn't do most of the computation in postgres.

### Other Random Scalability Thoughts

I foresee this `blend` method being quite a chonker. I would probably end up gating this computation behind some sort of rate limited paired with a AMQP queue to better handle the intense workload.

## It All Comes Crashing Down

I can't get raw listening data from Spotify...

tf???

They only publish the last 50 listened songs. This means that if I want to compute scoring myself and bypass the `/me/top/*` API routes, I have to also build a Spotify poller. Now, this is _fine_ and not really that challenging. I've done something similar [before](/writing/spotipub), but it's worth mentioning if only because I want to complain about it.

I haven't built this out yet, so I'm sure I'll run into a whole host of issues, but for now I think it's a fairly solid structure. I'd be lying if I said I wasn't honestly really excited to build this- it just means that once I do, anyone using this will have to wait a month for their data to populate because I'm fairly certain most people don't have a last.fm account, and I don't want to deal with building out a Spotify extended listening import tool like stats.fm has.

Peace and love- it's a terrible UX.

## So Anyway

Wish me luck!!
