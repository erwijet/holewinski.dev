import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import { generateOgImageForProject } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const writings = await getCollection("writings").then((ws) =>
    ws.filter(({ data }) => !data.draft && !data.ogImage),
  );

  return writings.map((w) => ({
    params: { slug: getPath(w.id, w.filePath, false) },
    props: w,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const buffer = await generateOgImageForProject(
    props as CollectionEntry<"writings">,
  );

  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
};
