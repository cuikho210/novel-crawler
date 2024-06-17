import { getChapter, fetchBookData } from "../crawlers/metruyencv";
import { exportToEpub } from "../exporters/to-epub";
import { resolve } from "path";
import type { Chapter } from "../crawlers/types";

const bookId = 117384;
const bookInfo = await fetchBookData(bookId);
const chapters = await getChapters();

const title = bookInfo.extra.book.name;
const author = 'Cuikho210';
const exportPath = resolve(__dirname, bookInfo.extra.book.slug + '.epub');

exportToEpub({ title, author, chapters, }, exportPath);

export async function getChapters(): Promise<Chapter[]> {
	const chapters: Chapter[] = [];
	const promises = <Promise<void>[]>[];

	for (const chap of bookInfo.data) {
		promises.push(new Promise(async (resolve) => {
			const chapter = await getChapter(bookInfo.extra.book.slug, chap);
			chapters.push(chapter);
			resolve();
		}));
	}

	await Promise.all(promises);

	const sorted = chapters.sort((a, b) => a.index - b.index);
	return sorted;
}
