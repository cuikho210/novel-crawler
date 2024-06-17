import { getAllChapterUrls, getChapter } from "../crawlers/truyencv";
import { exportToEpub } from "../exporters/to-epub";
import { readFileSync } from 'fs';
import type { Chapter } from "../crawlers/types";

const novelName = 'chan-nuoi-toan-nhan-loai';
const json = readFileSync('./chapters.json', { encoding: 'utf8' });
const chapters = JSON.parse(json as string);

exportToEpub(
	{
		title: 'Chăn nuôi toàn nhân loại',
		author: 'Cuikho210',
		chapters,
	},
	'/home/cuikho210/Documents/docs/' + novelName + '.epub',
);

export async function getChapters(novelName: string): Promise<Chapter[]> {
	const urls = await getAllChapterUrls(novelName);
	const chapters: Chapter[] = [];

	for (let i = 0; i < urls.length; i++) {
		const url = urls[i];
		const chapter = await getChapter(url, i);
		chapters.push(chapter);
	}

	return chapters;
}
