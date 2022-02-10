import tap from 'tap';
import mock from 'mock-fs';

import { isSnowstormProject } from './is-snowstorm-project.js';

void tap.test('isSnowstormProject', async t => {
	t.afterEach(() => mock.restore());

	const mockFolder = (x: any) => mock({ '/test/isSnowstormProject': x });
	const run = () => isSnowstormProject('/test/isSnowstormProject');

	void t.test('normal site', async t => {
		mockFolder({
			'package.json': '{"dependencies": {"@snowstorm/core": "*"}}',
			pages: {},
		});
		t.ok(run());
	});

	void t.test('normal site, dev deps', async t => {
		mockFolder({
			'package.json': '{"devDependencies": {"@snowstorm/core": "*"}}',
			pages: {},
		});
		t.ok(run());
	});

	void t.test('normal site, sites folder', async t => {
		mockFolder({
			'package.json': '{"devDependencies": {"@snowstorm/core": "*"}}',
			sites: {},
		});
		t.ok(run());
	});

	void t.test('normal site, pages and sites folder', async t => {
		mockFolder({
			'package.json': '{"devDependencies": {"@snowstorm/core": "*"}}',
			pages: {},
			sites: {},
		});
		t.ok(run() instanceof Error);
	});

	void t.test('normal site, missing dependency', async t => {
		mockFolder({
			'package.json': '{}',
			pages: {},
		});
		t.ok(run() instanceof Error);
	});

	void t.test('normal site, missing folder', async t => {
		mockFolder({
			'package.json': '{"dependencies": {"@snowstorm/core": "*"}}',
		});
		t.ok(run() instanceof Error);
	});
});
