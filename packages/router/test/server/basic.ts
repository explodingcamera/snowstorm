import tap from 'tap';
import type { Route } from '../../src/server/index.js';
import { processRoute } from '../../src/server/index.js';

void tap.test('processRoute should handle edge-cases: ', t => {
	const shouldErr = ['', '/test', '../../test', '%$@#.asdfasdf.asd'];
	for (const route of shouldErr) {
		void t.test(`${route} should throw`, async t => {
			t.throws(() => processRoute(route));
		});
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
		t.comment('should eq: ', route, res);
		t.same(processRoute(route), res);
	}

	t.end();
});
