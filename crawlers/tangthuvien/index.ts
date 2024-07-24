import { getAllChapterUrls } from './list-chap';
import { getChapter } from './get-chap-content';
import type { Book, Chapter } from '../types';

async function getAllChapters(urls: string[], slug: string): Promise<Chapter[]> {
	console.log('[getAllChapters] Init');
	const chapters: Chapter[] = [];
	let promises: Promise<void>[] = [];

	let index = 1;
	for (const url of urls) {
		promises.push(new Promise<void>(async (resolve) => {
			const chapter = await getChapter(url, index, slug);
			chapters.push(chapter);
			resolve();
		}))

		index += 1;

		if (promises.length >= 2) {
			await Promise.all(promises);
			promises = [];
		}
	}

	console.log('[getAllChapters] Start sort and return');
	const sorted = chapters.sort((a, b) => a.index - b.index);
	return sorted;
}

export async function getBook(props: {
	bookId: number,
	bookName: string,
	slug: string,
	author: string,
}): Promise<Book> {
	console.log('[getBook] start fetchBookData');
	const chaterUrls = await getAllChapterUrls(props.bookId);

	console.log('[getBook] start getAllChapters');
	const chapters = await getAllChapters(chaterUrls, props.slug);
	
	console.log('[getBook] Done!');
	return {
		name: props.bookName,
		slug: props.slug,
		author: props.author,
		chapters,
	}
}
