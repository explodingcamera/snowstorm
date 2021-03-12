import { readFile } from 'fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createConfiguration, ServerRuntime, startServer } from 'snowpack';

import Koa from 'koa';
import serve from 'koa-static';
import * as config from './snowpack.config.js';

const app = new Koa();

const serverConfig = createConfiguration({
	...config,
	plugins: [],
	optimize: { bundle: false, minify: false, target: 'es2020' },
});
let snowpackRuntime: ServerRuntime;

app.use(serve('dist', { index: false }));

app.use(async ctx => {
	// Server-side import our React component
	const importedComponent = await snowpackRuntime.importModule('/dist/app.js');
	const Component = importedComponent.exports.App;

	// Render your react component to HTML
	const html = renderToString(createElement(Component, null));

	// Load contents of index.html
	const htmlFile = await readFile('./dist/index.html', 'utf8');

	// Inserts the rendered HTML into our main div
	const document = htmlFile.replace(
		/<div id="app"><\/div>/,
		`<div id="app">${html}</div>`,
	);

	// Sends the response back to the client
	ctx.body = document;
});

(async () => {
	const snowpackServer = await startServer({
		config: { ...serverConfig },
		lockfile: null,
	});
	snowpackRuntime = snowpackServer.getServerRuntime();
	app.listen(2000);
	console.log('>> listening on port 2000 <<');
})();
