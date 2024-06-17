import { HOST_CHAPTER_CONTENT, USER_AGENT } from "./config";
import { JSDOM } from "jsdom";
import { sleep } from "bun";
import type { Chapter } from '../types';
import type {ChapterInfo} from "./list-chap";

async function fetchPageHtml(uri: string): Promise<string> {
	const url = HOST_CHAPTER_CONTENT + uri;
	console.log('[fetchPageHtml] fetching from', url);

	const headers = new Headers();
	headers.set('user-agent', USER_AGENT);

	const res = await fetch(url, { headers });
	const html = await res.text();
	return html;
}

function getChapterContent(html: string): Element | null {
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const contentEl = doc.querySelector('[data-x-bind="ChapterContent"]');

	if (!contentEl) return null;
	return contentEl;
}

export async function getChapter(slug: string, chap: ChapterInfo): Promise<Chapter> {
	const uri = `/${slug}/chuong-${chap.index}`;
	const html = await fetchPageHtml(uri);
	let content = '';

	while (true) {
		const el = getChapterContent(html);
		if (!el) throw new Error('Cannot get chapter content');

		const wordCount = el.textContent!.split(' ').length;
		if (chap.word_count - wordCount < 200) break;

		console.log('[getChapter] Word count:', chap.word_count, 'vs', wordCount);
		console.log('[getChapter] Start re-download', chap.index, chap.name);
	}

	console.log('[getChapter] Downloaded', chap.index, chap.name);
	return {
		index: chap.index,
		title: chap.name,
		content,
	}
}
