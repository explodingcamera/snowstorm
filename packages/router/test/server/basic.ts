import tap from 'tap';
import { processRoute, Route } from '../../src/server/index.js';

void tap.test('', t => {
	const shouldErr = [''];
	for (const route of shouldErr) {
		t.throws(() => processRoute(route));
	}

	const shouldNotErr: Array<[string, Route]> = [
		[
			'test',
			{
				path: '/test',
				name: 'test',
				parts: ['test'],
				decorator: undefined,
			},
		],
		[
			'a/b/c',
			{
				path: '/a/b/c',
				name: 'a/b/c',
				parts: ['a', 'b', 'c'],
				decorator: undefined,
			},
		],
		[
			'a/b.bar',
			{
				path: '/a/b',
				name: 'a/b',
				parts: ['a', 'b'],
				decorator: 'bar',
			},
		],
		[
			'[a]/[b].bar',
			{
				path: '/:a/:b',
				name: '[a]/[b]',
				parts: [':a', ':b'],
				decorator: 'bar',
			},
		],
	];

	for (const [route, res] of shouldNotErr) {
		t.same(processRoute(route), res);
	}

	t.end();
});
