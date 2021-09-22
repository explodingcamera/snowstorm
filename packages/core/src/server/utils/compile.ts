import typescript, { CompilerOptions } from 'typescript';
import { readFile } from 'fs/promises';

const { ModuleKind, ScriptTarget, transpileModule } = typescript;
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
