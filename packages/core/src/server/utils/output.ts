import fs from 'node:fs/promises';
import path from 'node:path';
import { checkFileExists } from './file-exists';

interface WriteFileOptions {
	encoding?: BufferEncoding | string | null | undefined;
	flag?: string | undefined;
	mode?: number | undefined;
}

const getMode = (options: unknown) => {
	const defaults = { mode: 0o777 };
	if (typeof options === 'number') return options;
	if (typeof options !== 'object') throw new Error('whut');
	return { ...defaults, ...options }.mode;
};

export async function outputFile(
	file: string,
	data: any,
	options?: WriteFileOptions | BufferEncoding | string,
): Promise<void> {
	const encoding = ((typeof options === 'object'
		? options.encoding
		: options) || 'utf8') as BufferEncoding;

	const dir = path.dirname(file);
	const exists = await checkFileExists(dir);
	if (exists) return fs.writeFile(file, data, encoding);

	await fs.mkdir(dir, {
		mode: getMode(options),
		recursive: true,
	});

	await fs.writeFile(file, data, encoding);
}
