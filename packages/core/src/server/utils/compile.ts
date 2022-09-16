import type { CompilerOptions } from 'typescript';
import typescript from 'typescript';
import { readFile } from 'node:fs/promises';

const { ModuleKind, ScriptTarget, transpileModule, ModuleResolutionKind } =
	typescript;

const options: CompilerOptions = {
	allowJs: true,
	checkJs: true,
	skipLibCheck: true,
	lib: ['DOM', 'ESNext'],
	resolveJsonModule: true,
	moduleResolution: ModuleResolutionKind.NodeJs,
	allowSyntheticDefaultImports: true,
	target: ScriptTarget.ESNext,
	module: ModuleKind.ESNext,
	esModuleInterop: true,
};

export const compile = async (file: string) => {
	const code = await readFile(file);
	const res = transpileModule(code.toString(), { compilerOptions: options });
	return res.outputText;
};
