import deepmerge from 'deepmerge';
import glob from 'glob-promise';
import { join } from 'path';
import {
	CompilerOptions,
	createCompilerHost,
	createProgram,
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

const baseConfig = {};
const defaultConfig = {};

export const loadConfig = async (projectPath: string) => {
	const files = await glob(join(projectPath, '/*'));
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
				const file = await compile(join(projectPath, `/${existingFiles[0]}`));
				const config = requireFromString(file);
				userConfig = config.default || config.Config || config;
				break;
			}

			case 'snowstorm.config.json': {
				const config = await import(
					join(projectPath, '/snowstorm.config.json')
				);
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
