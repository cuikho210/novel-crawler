import { HOST_LIST_CHAPTER, USER_AGENT } from "./config";

export interface ChapterInfo {
	id: number
	name: string
	index: number
	word_count: number
	view_count: number
	user_id: number
	published_at: string
	unlock_price: number
	unlock_key_price: number
	is_locked: null | any
	object_type: string
}

export interface BookInfo {
	id: number
	name: string
	slug: string
	kind: number
	sex: number
	state: string
	status: number
	link: string
	status_name: string
	first_chapter: number
	latest_chapter: number
	latest_index: number
	synopsis: string
	object_type: string
}

interface BookDataExtra {
	book: BookInfo
}

export interface BookResponse {
	data: ChapterInfo[]
	success: boolean
	status: number
	message: string | null
	extra: BookDataExtra
}

export async function fetchBookData(bookId: number): Promise<BookResponse> {
	const uri = `/chapters?filter[book_id]=${bookId}&filter[type]=published`;
	const url = HOST_LIST_CHAPTER + uri;
	console.log('[fetchPageHtml] fetching from', url);

	const headers = new Headers();
	headers.set('user-agent', USER_AGENT);

	const res = await fetch(url, { headers });
	const data: BookResponse = await res.json();

	return data;
}
