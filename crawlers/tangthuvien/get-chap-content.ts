import { JSDOM } from "jsdom";
import {cache, loadCache} from "../../core/cache";
import he from 'he';
import type { Chapter } from '../types';

async function fetchPageHtml(url: string): Promise<string> {
	console.log('[fetchPageHtml] fetching from', url);
	const res = await fetch(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
		}
	});
	const html = await res.text();
	return html;
}

function getChapterTitle(html: string): string | null {
	const regex = /<title>.+<\/title>/gi;
	const matches = html.match(regex);
	if (!matches) return null;

	const encoded = matches[0].slice(7, -8);
	const title = he.decode(encoded);

	return title;
}

function getChapterContent(html: string): string | null {
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const contentEl = doc.querySelector('.box-chap');

	if (!contentEl) return null;
	let content = contentEl.innerHTML;
	content = content.replaceAll('\n', '<br />');
	content = content.replaceAll('\t', '&emsp;');

	return content;
}

export async function getChapter(url: string, index: number, slug: string): Promise<Chapter> {
	const cacheKey = 'tangthuvien___' + slug + '-' + index;
	let cachedChapter = await loadCache((cacheKey));
	if (cachedChapter) return JSON.parse(cachedChapter)

	const html = await fetchPageHtml(url);

	const title = getChapterTitle(html) || 'Chương ' + index;
	console.log(title)

	const content = getChapterContent(html);
	if (!content) throw new Error('Cannot get chapter content from ' + url + '; HTML: ' + html);

	const chapter: Chapter = { index, title, content }
	await cache(cacheKey, JSON.stringify(chapter));

	return chapter
}
