import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormConfig } from './server';
import { join } from 'path';
import serve from 'koa-static';

const startDate = Date.now();
const version = startDate.toString().substr(0, 5);

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

	let html: string;
	if (dev || (!dev && !cachedHtml)) {
		html = await (
			await devServer
				.getServerRuntime()
				.importModule('/_snowstorm/load-html.js')
		).exports.loadHTML({
			pathPrefix: outputFolder,
		});
		if (!dev && !cachedHtml) cachedHtml = html;
	} else {
		html = cachedHtml;
	}

	// Load contents of index.html
	let htmlFile: string;
	if (dev) {
		htmlFile = (await devServer.loadUrl('/')).contents.toString();
	} else {
		htmlFile = await readFile(join(outputFolder, './index.html'), 'utf8');
	}

	// Inserts the rendered HTML into our main div
	const doc = htmlFile
		.replace(
			/<div id="app"><\/div>/,
			`<div id="app"${(dev && 'data-hmr=true') || ''}>${html}</div>`,
		)
		.replace(/\/_snowstorm\/index.js/g, `/_snowstorm/index.js?v=${version}`);

	// Sends the response back to the client
	ctx.body = doc;
};
