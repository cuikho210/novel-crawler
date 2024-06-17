import Epub from 'epub-gen';
import type { Chapter } from "../crawlers/types";

export interface ExportToEpubOptions {
	title: string
	chapters: Chapter[]
	author: string

	/// Base64 image
	cover?: string

	lang?: string
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function exportToEpub(options: ExportToEpubOptions, destPath: string) {
	console.log('[exportToEpub] Init with destPath', destPath);

	const content: Epub.Chapter[] = options.chapters.map(chap => ({
		title: capitalizeFirstLetter(chap.title),
		data: chap.content,
	}));

	const epub = new Epub({
		title: options.title,
		author: options.author,
		cover: options.cover,
		lang: options.lang,
		content,
		output: destPath,
	});

	console.log('[exportToEpub] Ended');
	return epub;
}
