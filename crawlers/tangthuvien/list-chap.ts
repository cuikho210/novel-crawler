import {
	HOST,
	SLOT_NOVEL_ID,
} from "./config";

const LIST_CHAP_URI = `/page/${SLOT_NOVEL_ID}?page=0&limit=100000`;

async function fetchListChapterHtml(novelId: number | string): Promise<string> {
	const uri = LIST_CHAP_URI.replace(SLOT_NOVEL_ID, String(novelId));
	const url = HOST + uri;
	
	console.log('[fetchPageHtml] fetching from', url);
	const res = await fetch(url);
	const html = await res.text();

	return html;
}

function matchChaptersFromHtml(chaps: Set<string>, html: string) {
	const listUrl = html.match(/https:\/\/truyen\.tangthuvien\.vn\/doc-truyen\/.+\/.*chuong-\w+/gi);
	if (!listUrl) return;

	for (const url of listUrl) {
		chaps.add(url);
	}
}

export async function getAllChapterUrls(novelId: number | string): Promise<string[]> {
	const chapters = new Set<string>()
	const html = await fetchListChapterHtml(novelId);
	matchChaptersFromHtml(chapters, html);

	const urls = Array.from(chapters);
	return urls
}
