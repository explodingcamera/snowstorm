import { constants, promises as fs } from 'fs';

export async function checkFileExists(file: string) {
	return fs
		.access(file, constants.F_OK)
		.then(() => true)
		.catch(() => false);
}
