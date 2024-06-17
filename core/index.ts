import { getAllChapterUrls, getChapter } from "../crawlers/truyencv";
import { exportToEpub } from "../exporters/to-epub";
import { resolve } from "path";
import type { Chapter } from "../crawlers/types";

const novelName = 'tham-uyen-nu-than-vuc-sau-nu-than';
const title = 'Thâm Uyên Nữ Thần';
const author = 'Đằng La Vi Chi';
const chapters = await getChapters(novelName);
const exportPath = resolve(__dirname, novelName + '.epub');

exportToEpub({ title, author, chapters, }, exportPath);

export async function getChapters(novelName: string): Promise<Chapter[]> {
	const urls = await getAllChapterUrls(novelName);
	const chapters: Chapter[] = [];

	for (let i = 0; i < urls.length; i++) {
		const url = urls[i];
		const chapter = await getChapter(url, i);
		chapters.push(chapter);
	}

	return chapters;
}
