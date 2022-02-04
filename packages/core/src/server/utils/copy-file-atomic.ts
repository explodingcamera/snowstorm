import { readFile } from 'node:fs/promises';
import writeFileAtomic from 'write-file-atomic';

export const copyFileAtomic = async (file: string, dest: string) => {
	const data = await readFile(file);
	return writeFileAtomic(dest, data);
};
