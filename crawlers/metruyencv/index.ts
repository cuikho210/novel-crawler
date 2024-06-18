import { fetchBookData } from './list-chap';
import { getChapter } from './get-chap-content';
import type { BookResponse } from './list-chap';
import type { Book, Chapter } from '../types';

async function getAllChapters(bookInfo: BookResponse): Promise<Chapter[]> {
	console.log('[getAllChapters] Init');
	const chapters: Chapter[] = [];

	const promises = bookInfo.data.map<Promise<void>>(chap => new Promise(async (resolve) => {
		const chapter = await getChapter(bookInfo.extra.book.slug, chap);
		chapters.push(chapter);
		resolve();
	}));
	await Promise.all(promises);

	console.log('[getAllChapters] Start sort and return');
	const sorted = chapters.sort((a, b) => a.index - b.index);
	return sorted;
}

export async function getBook(bookId: number, author = 'Cuikho210'): Promise<Book> {
	console.log('[getBook] start fetchBookData');
	const bookInfo = await fetchBookData(bookId);

	console.log('[getBook] start getAllChapters');
	const chapters = await getAllChapters(bookInfo);
	
	console.log('[getBook] Done!');
	return {
		name: bookInfo.extra.book.name,
		slug: bookInfo.extra.book.slug,
		author,
		chapters,
	}
}
