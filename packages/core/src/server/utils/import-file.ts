import glob from 'glob-promise';
import requireFromString from 'require-from-string';
import { join } from 'path';
import { compile } from './compile';

const supportedFileEndings = ['.ts', '.js', '.cjs', '.mjs', '.json'];

export async function importFile<FileType>(
	path: string,
	file: string,
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
	try {
		const filename = existingFiles[0] || undefined;
		if (!filename) {
			throw new Error('no files');
		}

		if (
			['.ts', '.js', '.mjs', '.cjs']
				.map(fileEnding => `${file}${fileEnding}`)
				.includes(filename)
		) {
			const file = await compile(join(path, `/${filename}`));
			const config = requireFromString(file);
			importedFile =
				config.default || (exportKey && config?.[exportKey]) || config;
		}

		if (filename === `${filename}.json`) {
			const config = await import(join(path, '/snowstorm.config.json'));
			importedFile = config.default;
		}
	} catch (error: unknown) {}

	return importedFile;
}
