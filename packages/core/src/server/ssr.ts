import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormConfig } from './server';
import { join } from 'path';
import serve from 'koa-static';

export const ssr = ({
	devServer,
	dev,
	outputFolder,
	config,
}: {
	devServer: SnowpackDevServer;
	dev: boolean;
	outputFolder: string;
	config: SnowstormConfig;
}): Middleware => async (ctx, next) => {
	if (ctx.path.startsWith('/_snowstorm')) {
		console.log(outputFolder);
		serve(outputFolder)(ctx, next);
		return;
	}

	const html: string = await (
		await devServer.getServerRuntime().importModule('/_snowstorm/load-html.js')
	).exports.loadHTML({
		pathPrefix: outputFolder,
		routes: [],
	});

	// Load contents of index.html
	let htmlFile: string;
	if (dev) {
		htmlFile = (await devServer.loadUrl('/')).contents.toString();
	} else {
		htmlFile = await readFile(join(outputFolder, './index.html'), 'utf8');
	}

	// Inserts the rendered HTML into our main div
	const doc = htmlFile.replace(
		/<div id="app"><\/div>/,
		`<div id="app"${(devServer && 'data-hmr=true') || ''}>${html}</div>`,
	);
	// .replace(/(\r\n|\n|\r)/gm, '');

	// Sends the response back to the client
	ctx.body = doc;
};
