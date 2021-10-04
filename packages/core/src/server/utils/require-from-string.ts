import { Module } from 'module';
import path from 'path';

export function requireFromString(code: string, filename?: string) {
	filename = filename || '';

	if (typeof code !== 'string') {
		throw new Error('code must be a string, not ' + typeof code);
	}

	// @ts-expect-error undocumented api
	const paths = Module._nodeModulePaths(path.dirname(filename));
	const m = new Module(filename);
	m.filename = filename;
	m.paths = paths;

	// @ts-expect-error undocumented api
	m._compile(code, filename);
	return m.exports;
}
