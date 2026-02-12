import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import projectOgImage from "./og-templates/project";
import siteOgImage from "./og-templates/site";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForProject(post: CollectionEntry<"posts">) {
  const svg = await projectOgImage(post);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
