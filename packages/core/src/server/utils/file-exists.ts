import { constants, promises as fs } from 'node:fs';

export async function checkFileExists(file: string) {
	return fs
		.access(file, constants.F_OK)
		.then(() => true)
		.catch(() => false);
}
