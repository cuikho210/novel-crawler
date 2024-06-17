import { HOST } from "./config";
import { JSDOM } from "jsdom";
import type { Chapter } from '../types';

async function fetchPageHtml(uri: string): Promise<string> {
	const url = HOST + uri;
	
	console.log('[fetchPageHtml] fetching from', url);
	const res = await fetch(url);
	const html = await res.text();
	return html;
}

function getChapterTitle(html: string): string | null {
	const regex = /">chương [0-9]+: .+<\/a><\/h2>/gi;
	const matches = html.match(regex);
	if (!matches) return null;

	const title = matches[0].substring(2).replace('</a></h2>', '');
	return title;
}

// function getChapterIndex(title: string): number | null {
// 	const regex = /chương [0-9]: /gi;
// 	const matches = title.match(regex);
// 	if (!matches) return null;
//
// 	const index = matches[0].substring(7).slice(0, -1);
// 	return Number(index);
// }

function getChapterContent(html: string): string | null {
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const contentEl = doc.querySelector('#content-chapter');

	if (!contentEl) return null;
	return contentEl.innerHTML;
}

export async function getChapter(uri: string, index: number): Promise<Chapter> {
	const html = await fetchPageHtml(uri);

	const title = getChapterTitle(html) || 'Chương ' + index;

	const content = getChapterContent(html);
	if (!content) throw new Error('Cannot get chapter content');

	return { index, title, content }
}
