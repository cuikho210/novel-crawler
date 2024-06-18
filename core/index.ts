import { exportToEpub } from "../exporters/to-epub";
import { getBook } from "../crawlers/metruyencv";
import { resolve } from "path";

const bookId = 117384;
const book = await getBook(bookId);
const destPath = resolve(__dirname, `${book.slug}.epub`);

exportToEpub({
	title: book.name,
	author: book.author,
	chapters: book.chapters
}, destPath);
