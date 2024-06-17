import {
	HOST,
	SLOT_NOVEL_NAME,
	SLOT_CHAPER_INDEX,
} from "./config";

const LIST_CHAP_URI = `/${SLOT_NOVEL_NAME}?page=${SLOT_CHAPER_INDEX}`;

async function fetchPageListChapterHtml(novelName: string, chapIndex: number): Promise<string> {
	const uri = LIST_CHAP_URI
		.replace(SLOT_NOVEL_NAME, novelName)
		.replace(SLOT_CHAPER_INDEX, String(chapIndex));
	const url = HOST + uri;
	
	console.log('[fetchPageHtml] fetching from', url);
	const res = await fetch(url);
	const html = await res.text();

	return html;
}

function matchChaptersFromHtml(chaps: Set<string>, html: string, novelName: string) {
	const regexChapUrl = new RegExp(`\/${novelName}\/chuong-[0-9]+`, 'gi');

	const listUrl = html.match(regexChapUrl);
	if (!listUrl) return;

	for (const url of listUrl) {
		chaps.add(url);
	}
}

function isLastPage(html: string): boolean {
	const regex = /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" fill="none" viewBox="0 0 24 24" stroke-width="1\.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8\.25 4\.5l7\.5 7\.5-7\.5 7\.5"><\/path><\/svg>/gi;
	const matches = html.match(regex);
	if (matches) return false;
	return true;
}

function sortChapters(urls: string[]) {
	return urls.sort((a, b) => {
		const regex = /[0-9]+$/g;
		const matchA = a.match(regex);
		const matchB = b.match(regex);

		if (!matchA || !matchB) return 1;

		const chapA = Number(matchA[0]);
		const chapB = Number(matchB[0]);
		if (chapA > chapB) return 1;
		return -1;
	});
}

export async function getAllChapterUrls(novelName: string): Promise<string[]> {
	const pageUrls = new Set<string>();
	let currentPage = 1;

	while (true) {
		const html = await fetchPageListChapterHtml(novelName, currentPage);
		matchChaptersFromHtml(pageUrls, html, novelName);

		const isBreak = isLastPage(html);
		if (isBreak) break;

		currentPage += 1;
	}

	const urls = Array.from(pageUrls);
	return sortChapters(urls);
}
