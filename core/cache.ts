import Bun from "bun";
import { resolve } from 'path';

const cacheDir = resolve(__dirname, 'cache');

function getDestPath(key: string): string {
	return resolve(cacheDir, key);
}

export async function cache(key: string, value: string): Promise<void> {
	const destPath = getDestPath(key);
	await Bun.write(destPath, value);
}

export async function loadCache(key: string): Promise<string | null> {
	const destPath = getDestPath(key);

	try {
		const file = Bun.file(destPath);
		return await file.text();
	} catch(e) {
		return null;
	}
}
