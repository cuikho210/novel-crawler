import { sleep } from "bun";
import { cache, loadCache } from "../../core/cache";
import type { Chapter } from "../types";
import { makeChapterContentUrl } from "./http";
import { JSDOM } from "jsdom";

export async function getChapter(
  index: number,
  bookSlug: string,
  chapSlug: string,
  title: string,
  sleepOnFetch = 0,
) {
  const cacheKey = "metruyenchu___" + bookSlug + "-" + index;
  let cachedChapter = await loadCache(cacheKey);
  if (cachedChapter) {
    console.log("Using cached version for chapter", index);
    return JSON.parse(cachedChapter);
  }

  console.log("Fetching chapter", index);
  const content = await fetchPageContent(bookSlug, chapSlug);
  const chapter: Chapter = { index, title, content };
  await cache(cacheKey, JSON.stringify(chapter));

  if (sleepOnFetch > 0) await sleep(sleepOnFetch);

  return chapter;
}

export async function fetchPageContent(
  bookSlug: string,
  chapSlug: string,
): Promise<string> {
  const url = makeChapterContentUrl(bookSlug, chapSlug);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
      Cookie: import.meta.env.COOKIE || "",
    },
  });
  const html = await res.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const content = doc.querySelector("article");
  if (!content) throw new Error("Could not find content element");

  return content.innerHTML;
}
