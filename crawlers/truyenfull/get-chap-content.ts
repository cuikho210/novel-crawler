import { JSDOM } from "jsdom";
import { CACHE_KEY } from "./config";
import { cache, loadCache } from "../../core/cache";
import type { Chapter } from "../types";
import { sleep } from "bun";

export async function getChapter(
  index: number,
  slug: string,
  title: string,
  chapUrl: string,
  sleepOnFetch = 0,
): Promise<Chapter> {
  const cacheKey = CACHE_KEY + slug + "-" + index;
  let cachedChapter = await loadCache(cacheKey);
  if (cachedChapter) {
    console.log("Using cached version for chapter", index);
    return JSON.parse(cachedChapter);
  }

  console.log("Fetching chapter", index);
  const content = await fetchPageContent(chapUrl);
  const chapter: Chapter = { index, title, content };
  await cache(cacheKey, JSON.stringify(chapter));

  if (sleepOnFetch > 0) await sleep(sleepOnFetch);

  return chapter;
}

async function fetchPageContent(chapUrl: string): Promise<string> {
  console.log("Fetching from", chapUrl);

  const res = await fetch(chapUrl);
  if (!res.ok)
    throw new Error(
      "Cannot fetch from " + chapUrl + " with status " + res.statusText,
    );
  const html = await res.text();

  const content = getContentFromHtml(html);
  if (!content) throw new Error("Content is empty");

  return content;
}

function getContentFromHtml(html: string): string | null {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  let contentEl = doc.querySelector("#chapter-c");

  if (!contentEl) {
    console.log("Cannot get chapter element from html", html);
    return null;
  }
  return contentEl.innerHTML;
}
