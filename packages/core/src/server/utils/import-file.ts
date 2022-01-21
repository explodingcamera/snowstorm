import glob from 'fast-glob';
import { readFile, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { compile } from './compile.js';

const supportedFileEndings = ['.ts', '.js', '.cjs', '.mjs', '.json'];

export async function importFile<FileType>(
	path: string,
	file: string,
	tempFileLocation: string,
	exportKey?: string,
): Promise<FileType | undefined> {
	const files = await glob(join(path, '/*'));

	const importFiles = supportedFileEndings.map(
		fileEnding => `${file}${fileEnding}`,
	);

	const existingFiles = importFiles.filter(cfg =>
		files.includes(join(path, '/', cfg)),
	);

	let importedFile;
	const tempPath = join(
		tempFileLocation,
		'snowstorm' + (Math.random() + 1).toString(36).substring(7) + '.mjs',
	);

	try {
		const filename = existingFiles[0] || undefined;
		if (!filename) {
			return;
		}

		if (
			['.ts', '.js', '.mjs', '.cjs']
				.map(fileEnding => `${file}${fileEnding}`)
				.includes(filename)
		) {
			const file = await compile(join(path, `/${filename}`));
			await writeFile(tempPath, file, 'utf8');

			await new Promise(resolve => {
				setTimeout(resolve, 100);
			});

			const config = await import(tempPath);

			importedFile =
				(exportKey && config?.[exportKey]) || config.default || config;
		}

		if (filename === `${filename}.json`) {
			const config = await import(join(path, '/snowstorm.config.json'));
			importedFile = config.default;
		}
	} catch (e: unknown) {
		console.error(e);
	}

	await unlink(tempPath);

	return importedFile;
}
