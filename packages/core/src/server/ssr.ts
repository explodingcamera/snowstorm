import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormConfig } from './config';
import { join } from 'path';
import serve from 'koa-static';

const startDate = Date.now();
const version = startDate.toString();

let cachedHtml: string;
export const ssr = ({
	devServer,
	dev,
	outputFolder,
	pagesFolder,
	config,
}: {
	devServer: SnowpackDevServer;
	dev: boolean;
	outputFolder: string;
	pagesFolder: string;
	config: SnowstormConfig;
}): Middleware => async (ctx, next) => {
	if (
		ctx.path.startsWith('/_snowstorm') ||
		ctx.path.startsWith('/favicon.ico')
	) {
		serve(outputFolder)(ctx, next);
		return;
	}

	if (!dev) {
		ctx.status = 200;
		ctx.set('ETag', version);

		if (ctx.fresh) {
			ctx.status = 304;
			return;
		}
	}

	const { loadPage, renderPage, processSPs, collectProps } = (
		await devServer.getServerRuntime().importModule('/_snowstorm/load-html.js')
	).exports;

	const page = await loadPage({ path: ctx.path });

	await processSPs();

	const html: string = await renderPage({
		...page,
		path: ctx.path,
	});

	// Load contents of index.html
	let htmlFile: string;
	if (dev) {
		htmlFile = (await devServer.loadUrl('/')).contents.toString();
	} else if (!dev && cachedHtml) {
		htmlFile = cachedHtml;
	} else {
		htmlFile = await readFile(join(outputFolder, './index.html'), 'utf8');
	}

	const props: string = await collectProps();

	// Inserts the rendered HTML into our main div
	const doc = htmlFile
		.replace(
			/<div id="app"><\/div>/,
			`<div id="app"${(dev && 'data-hmr=true') || ''}>${html}</div>`,
		)
		.replace(/\/_snowstorm\/index.js/g, `/_snowstorm/index.js?v=${version}`)
		.replace(
			'<!-- SNOWPACK DATA -->',
			props.length
				? `<script id="__serverprops" type="application/json">${props}</script>`
				: '',
		);

	// Sends the response back to the client
	ctx.body = doc;
};
