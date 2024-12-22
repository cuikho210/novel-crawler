import { JSDOM } from "jsdom";
import { HOST } from "./config";

export interface TempChapter {
  title: string;
  url: string;
}

function makeChapterUrl(slug: string, pageNumber: number) {
  return `${HOST}/${slug}/trang-${pageNumber}`;
}

async function getChapters(slug: string, pageNumber: number) {
  const url = makeChapterUrl(slug, pageNumber);
  console.log("init get chapters from", url);

  const res = await fetch(url);
  const html = await res.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const totalPage = Number(
    (doc.getElementById("total-page") as HTMLInputElement).value,
  );
  const chapters: TempChapter[] = [];
  const listChapterElements = doc.querySelectorAll(".list-chapter li a");

  listChapterElements.forEach((element) => {
    if (!element.textContent) throw console.error("Title is null");

    const url = element.getAttribute("href");
    if (!url) throw console.error("url is null");

    chapters.push({
      title: (element.textContent || "").trim(),
      url,
    });
    console.log("found chapter", url);
  });

  return { chapters, isEnd: totalPage === pageNumber };
}

export async function listAllChapters(slug: string) {
  let allChapters: TempChapter[] = [];
  let page = 0;

  while (true) {
    page += 1;
    const { chapters, isEnd } = await getChapters(slug, page);
    allChapters = allChapters.concat(chapters);

    if (isEnd) break;
  }

  return allChapters;
}
