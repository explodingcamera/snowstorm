import deepmerge from 'deepmerge';
import glob from 'glob-promise';
import { join } from 'path';
import {
	CompilerOptions,
	ModuleKind,
	ScriptTarget,
	transpileModule,
} from 'typescript';
import requireFromString from 'require-from-string';
import { readFile } from 'fs/promises';

const configFiles = [
	'snowstorm.config.ts',
	'snowstorm.config.js',
	'snowstorm.config.cjs',
	'snowstorm.config.mjs',
	'snowstorm.config.json',
];

export interface SnowstormConfigInternal {
	test?: true;
	internal: {
		snowstormFolder: string;
		snowpackFolder: string;
		internalFolder: string;
		pagesFolder: string;
		assetsFolder: string;
		clientFolder: string;
	};
}

type SnowstormConfig = Partial<SnowstormConfigInternal>;

export const loadConfig = async (
	path: string,
): Promise<SnowstormConfigInternal> => {
	const snowstormFolder = join(path, './.snowstorm');
	const snowpackFolder = join(snowstormFolder, './out');
	const internalFolder = join(snowstormFolder, './internal');
	const pagesFolder = join(path, './pages');
	const assetsFolder = join(__dirname, '../assets/public');
	const clientFolder = join(__dirname, '../client');

	const baseConfig: SnowstormConfig = {
		internal: {
			snowstormFolder,
			snowpackFolder,
			internalFolder,
			pagesFolder,
			assetsFolder,
			clientFolder,
		},
	};

	const files = await glob(join(path, '/*'));
	const existingFiles = configFiles.filter(cfg =>
		files.find(file => file.endsWith(cfg)),
	);

	let userConfig;
	try {
		switch (existingFiles[0] || undefined) {
			case 'snowstorm.config.ts':
			case 'snowstorm.config.js':
			case 'snowstorm.config.mjs':
			case 'snowstorm.config.cjs': {
				const file = await compile(join(path, `/${existingFiles[0]}`));
				const config = requireFromString(file);
				userConfig = config.default || config.Config || config;
				break;
			}

			case 'snowstorm.config.json': {
				const config = await import(join(path, '/snowstorm.config.json'));
				userConfig = config.default;
				break;
			}

			default:
				userConfig = baseConfig;
		}
	} catch (error: unknown) {
		userConfig = baseConfig;
	}

	return deepmerge(
		baseConfig,
		typeof userConfig === 'object' ? userConfig : baseConfig,
	);
};

const options: CompilerOptions = {
	allowJs: true,
	checkJs: true,
	lib: ['ESNext'],
	target: ScriptTarget.ESNext,
	module: ModuleKind.CommonJS,
};

export const compile = async (file: string) => {
	const code = await readFile(file);
	const res = transpileModule(code.toString(), { compilerOptions: options });
	return res.outputText;
};
