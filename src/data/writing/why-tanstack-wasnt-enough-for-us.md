---
author: Tyler Holewinski
pubDatetime: 2026-05-10T03:52:58.281Z
title: Why Tanstack Query Wasn't Enough for Us
slug: why-tanstack-query-wasnt-enough-for-us
featured: true
draft: true
description: And how we handled thousands of diffs per second instead.
---

I really, _really_ liked [Tanstack Query](https://tanstack.com/query/latest), particularly how it handled `useInfiniteQuery`. We were entirely bought-in on it. However there was a single fatal flaw it didn't handle well...

## The Joys of Real-Time Updates

At [Bryx](https://bryx.com), we build software for first responders-- mostly fire and ems. This mean that real-time data is essential. Every single data source in our software is expected to update in real-time. Now, as we were building out our mass notification product, this was less important since changes to server data were almost always the result of user-action. This meant that it was sufficient to use the `refetch` method exposed by `useInfiniteQuery`.

However, the engineering team recently made the decision to modernize the API for our core services, which displays less a snapshot of data, and rather a stream of real-time dispatch data. This modernization effort was largely build around GraphQL, which did away with our bespoke websocket protocol we had homebrewed for previous incarnations of Bryx911.

Real-time updates in GraphQL are fun. you kinda have 2 options:

1. When we get notified of a change, `refetch`
2. When we get notified of a change, manually update the `queryData` to reflect that change

Due to the sheer frequency of data change, gql `subscriptions` broadcast diffs rather than full replacements of list state. A client subscribes to a changestream for a specific resource, and gets a payload in the shape of

```ts
type Update<T> = {
  type: `CREATE` | 'UPDATE' | 'DELETE',
  <resource_name>: T
}
```

Now this is fine, right? Let's walk through using tanstack query to subscribe to an infinite query of "OPEN" 911 jobs.

```tsx
const q = useInfiniteQuery({
  queryKey: ["jobs", "OPEN"],
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
  queryFn: ({ pageParam }) =>
    gqlx(
      gql`
        query OpenJobs($pageParam: ID) {
          jobs(first: 10, after: $pageParam, disposition: [OPEN]) {
            ...Job
          }
        }
      `,
      { pageParam },
    ),
});

useGqlSubscription(
  gql`
    subscription LiveJobs {
      job {
        type
        job {
          ...Job
        }
      }
    }
  `,
  {
    onData({ type, job }) {
      queryClient.setQueryData(["jobs", "OPEN"], ({ pageParams, pages }) => {
        // apply 'job' to the correct 'page' in the correct position
      });
    },
  },
);
```

Now, this poses a whole litany of issues...

### How do we determine which page to put the inserted item into?

Well, I guess we would have to establish a `sort`. But what happens if we insert at the "end" of the list and go to fetch a new page? The `cursor` is not strictly an ID, and we have no way of deriving a `cursor` from a document itself. Perhaps we could just... let tanstack query override it? But this becomes very messy and unstable. We actually went down this approach, and found that data would flicker in and out of view. It was, in general, fragile, bespoke, unabstractable, and error-prone

###
