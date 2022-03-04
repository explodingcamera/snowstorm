import tap from 'tap';
import { fileIsPage } from './is-page.js';

void tap.test('fileIsPage', async t => {
	const pass = ['index.js', 'pages/page.tsx', 'page.md', 'page.mdx'];
	const fail = ['', 'index.html', 'index.js.old'];

	for (const file of pass) t.ok(fileIsPage(file));
	for (const file of fail) t.notOk(fileIsPage(file));
});
