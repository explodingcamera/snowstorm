import tap from 'tap';

import {
	stripFileExtension,
	stripFileExtensions,
} from './strip-file-extension.js';

void tap.test('stripFileExtension', async t => {
	const tests: Array<[string, ReturnType<typeof stripFileExtension>]> = [
		['', undefined],
		['index.js', 'index'],
		['index.js.ts', 'index.js'],
	];

	for (const [a, b] of tests) t.same(b, stripFileExtension(a));
});

void tap.test('stripFileExtensions', async t => {
	t.same(stripFileExtensions([]), []);
	t.same(stripFileExtensions(['']), []);
	t.same(stripFileExtensions(['index.js']), ['index']);
});
