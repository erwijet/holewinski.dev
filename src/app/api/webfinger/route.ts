import { NextResponse } from "next/server";

export function GET(req: Request) {
  const url = new URL(req.url);
  const resource = url.searchParams.get("resource");

  const aliases = [
    "tyler@holewinski.dev",
    "tyler@social.holewinski.dev",
    "holewinski.dev",
  ].map((it) => `acct:${it}`);

  if (!resource || aliases.includes(resource))
    return NextResponse.redirect(
      "https://social.holewinski.dev/.well-known/webfinger/?resource=acct:tyler@social.holewinski.dev"
    );

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
