import { listAllChapters, type TempChapter } from "./list-chap";
import { getChapter } from "./get-chap-content";
import type { Book, Chapter } from "../types";

async function fetchChapterContents(
  urls: TempChapter[],
  slug: string,
): Promise<Chapter[]> {
  const chapters: Chapter[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const chapter = await getChapter(i, slug, url.title, url.url, 500);
    chapters.push(chapter);
  }

  chapters.sort((a, b) => a.index - b.index);
  return chapters;
}

export async function getBook(props: {
  bookName: string;
  slug: string;
  author: string;
}): Promise<Book> {
  console.log("[getBook] start fetchBookData");
  const chapterUrls = await listAllChapters(props.slug);

  console.log("[getBook] start getAllChapters");
  const chapters = await fetchChapterContents(chapterUrls, props.slug);

  console.log("[getBook] Done!");
  return {
    name: props.bookName,
    slug: props.slug,
    author: props.author,
    chapters,
  };
}
