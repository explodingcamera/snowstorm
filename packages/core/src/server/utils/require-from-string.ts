import vm from 'vm';
import { createRequire } from 'module';

export function requireFromString(code: string) {
	const context = vm.createContext({
		exports: {},
		require: createRequire(import.meta.url),
	});

	vm.runInContext(code, context, {
		timeout: 100,
		breakOnSigint: true,
		displayErrors: true,
	});
}

// export function requireFromString(code: string, filename?: string) {
// 	filename = filename || 'snowstorm.config.js';

// 	console.log('requiring from string');

// 	if (typeof code !== 'string') {
// 		throw new Error('code must be a string, not ' + typeof code);
// 	}

// 	// @ts-expect-error undocumented api
// 	const paths = Module._nodeModulePaths(path.dirname(filename));
// 	const m = new Module(filename);
// 	m.filename = filename;
// 	m.paths = paths;
// 	// @ts-expect-error undocumented api
// 	m._compile(code, filename);
// 	return m.exports;
// }
