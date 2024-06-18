import { HOST_CHAPTER_CONTENT, USER_AGENT } from "./config";
import { Browser, Builder, By, until } from 'selenium-webdriver';
import Asynclock from 'async-lock';
import { JSDOM } from 'jsdom';
import type { Chapter } from '../types';
import type { ChapterInfo } from "./list-chap";

const lock = new Asynclock();
const lockKey = 'lock-selenium';

async function seleniumFetchChapterContent(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		lock.acquire(
			lockKey,
			async (done) => {
				console.log('[seleniumFetchChapterContent] fetching from', url);

				const driver = await new Builder()
					.forBrowser(Browser.FIREFOX)
					.build();
				await driver.get(url);
				
				const locatorChapContent = By.css('[data-x-bind="ChapterContent"]');
				const locatorLoadMore = By.id('load-more');
				const locatorSpinner = By.css('[data-x-show="isLoading"]');

				const chapContentEl = await driver.findElement(locatorChapContent);
				const loadMoreEl = await driver.findElement(locatorLoadMore);
				const spinnerEls = await driver.findElements(locatorSpinner);

				for (const spinner of spinnerEls) {
					await driver.wait(until.elementIsNotVisible(spinner));
				}
				await driver.sleep(500);

				const content1 = await chapContentEl.getAttribute('innerHTML');
				const content2 = await loadMoreEl.getAttribute('innerHTML');

				await driver.close();
				const content = content1 + content2;
				done(null, content);
			},
			(err, content) => {
				if (err) reject(err);
				resolve(content as string);
			}
		);
	});
}

async function fetchPageHtml(url: string): Promise<string> {
	console.log('[fetchPageHtml] fetching from', url);

	const headers = new Headers();
	headers.set('user-agent', USER_AGENT);

	const res = await fetch(url, { headers });
	const html = await res.text();
	return html;
}

async function normalFetchChapterContent(url: string): Promise<string> {
	const html = await fetchPageHtml(url);
	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const contentEl = doc.querySelector('[data-x-bind="ChapterContent"]');

	if (!contentEl) return '';
	return contentEl.innerHTML;
}

function isContentCorrect(content: string, chap: ChapterInfo): boolean {
	if (!content.length) return false;
	
	const words = content.split(' ');
	if (chap.word_count - words.length > 222) return false;

	return true;
}

async function getChapterContent(uri: string, chap: ChapterInfo): Promise<string> {
	const url = HOST_CHAPTER_CONTENT + uri;
	let content = await normalFetchChapterContent(url);

	const isCorrect = isContentCorrect(content, chap);
	if (isCorrect) return content;

	content = await seleniumFetchChapterContent(url);
	return content;
}

export async function getChapter(slug: string, chap: ChapterInfo): Promise<Chapter> {
	const uri = `/${slug}/chuong-${chap.index}`;
	const content = await getChapterContent(uri, chap);

	console.log('[getChapter] Downloaded', chap.index, chap.name);
	return {
		index: chap.index,
		title: chap.name,
		content,
	}
}
