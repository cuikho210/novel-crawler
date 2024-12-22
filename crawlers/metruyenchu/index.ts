import { getChapter } from "./get-chap-content";
import type { Book, Chapter } from "../types";
import { listChapterToc, type ChapterToc } from "./list-chap";

async function fetchChapterContents(
  tocs: ChapterToc[],
  slug: string,
): Promise<Chapter[]> {
  const chapters: Chapter[] = [];

  for (let i = 0; i < tocs.length; i++) {
    const toc = tocs[i];
    const chapter = await getChapter(i, slug, toc.slug, toc.name);
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
  const chapterUrls = await listChapterToc(props.slug);

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
