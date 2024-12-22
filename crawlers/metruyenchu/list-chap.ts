import { makeChapterListUrl } from "./http";

export interface ChapterToc {
  slug: string;
  name: string;
}

export async function listChapterToc(slug: string): Promise<ChapterToc[]> {
  const url = makeChapterListUrl(slug);

  console.log("Getting toc for:", url);
  const res = await fetch(url);
  const data = await res.json();
  const jsonString = new TextDecoder("utf-8").decode(
    Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0)),
  );
  const listToc: ChapterToc[] = JSON.parse(jsonString);

  return listToc;
}
