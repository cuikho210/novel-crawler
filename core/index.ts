import { exportToEpub } from "../exporters/to-epub";
import { getBook } from "../crawlers/tangthuvien";
import { resolve } from "path";

const book = await getBook({
	bookId: 30569,
	bookName: 'Ta Có Một Thân Bị Động Kỹ',
	author: 'cuikho210',
	slug: 'nga-huu-nhat-than-bi-dong-ky',
});
const destPath = resolve(__dirname, `${book.slug}.epub`);

exportToEpub({
	title: book.name,
	author: book.author,
	chapters: book.chapters
}, destPath);
