import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse(
    JSON.stringify({
      subject: "acct:tyler@social.holewinski.dev",
      aliases: [
        "https://social.holewinski.dev/@tyler",
        "https://social.holewinski.dev/users/tyler",
      ],
      links: [
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: "https://social.holewinski.dev/@tyler",
        },
        {
          rel: "self",
          type: "application/activity+json",
          href: "https://social.holewinski.dev/users/tyler",
        },
        {
          rel: "http://ostatus.org/schema/1.0/subscribe",
          template:
            "https://social.holewinski.dev/authorize_interaction?uri={uri}",
        },
        {
          rel: "http://webfinger.net/rel/avatar",
          type: "image/jpeg",
          href: "https://social.holewinski.dev/system/accounts/avatars/113/936/384/323/503/767/original/c4a58feb74375052.jpg",
        },
      ],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/jrd+json" },
    }
  );
}
