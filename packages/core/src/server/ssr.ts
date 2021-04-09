import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormConfigInternal } from './config';
import { join } from 'path';
import serve from 'koa-static';

const startDate = Date.now();
const version = startDate.toString();

let cachedHtml: string;
export const ssr = ({
	devServer,
	dev,
	config,
}: {
	devServer: SnowpackDevServer;
	dev: boolean;
	config: SnowstormConfigInternal;
}): Middleware => async (ctx, next) => {
	if (
		ctx.path.startsWith('/_snowstorm') ||
		ctx.path.startsWith('/favicon.ico')
	) {
		serve(config.internal.snowpackFolder)(ctx, next);
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

	const { loadPage, renderPage, processSPs, collectProps, getHead } = (
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
		htmlFile = await readFile(
			join(config.internal.snowpackFolder, './index.html'),
			'utf8',
		);
	}

	const props: string = await collectProps();
	const head = getHead();
	const basePath = config.server.basePath === '/' ? '' : config.server.basePath;

	// Inserts the rendered HTML into our main div
	const doc = htmlFile
		.replace(
			/<div id="app"><\/div>/,
			`<div id="app"${(dev && 'data-hmr=true') || ''}>${html}</div>`,
		)
		.replace(/\/_snowstorm\/index.js/g, `/_snowstorm/index.js?v=${version}`)
		.replace(/\/_snowstorm/g, `${basePath}/_snowstorm`)
		.replace(
			'<!-- SNOWPACK DATA -->',
			props.length
				? `<script id="__serverprops" type="application/json">${props}</script>`
				: '',
		)
		.replace('<!-- SNOWPACK HEAD -->', head);

	// Sends the response back to the client
	ctx.body = doc;
};
