import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormConfig } from './server';
import { join } from 'path';

export const ssr = ({
	devServer,
	dev,
	snowpackFolder,
	config,
}: {
	devServer: SnowpackDevServer;
	dev: boolean;
	snowpackFolder: string;
	config: SnowstormConfig;
}): Middleware => async ctx => {
	const html: string = await (
		await devServer.getServerRuntime().importModule('/dist/load-html.js')
	).exports.loadHTML();

	// Load contents of index.html
	let htmlFile: string;
	if (dev) {
		htmlFile = (await devServer.loadUrl('/')).contents.toString();
	} else {
		htmlFile = await readFile(join(snowpackFolder, './index.html'), 'utf8');
	}

	// Inserts the rendered HTML into our main div
	const doc = htmlFile
		.replace(
			/<div id="app"><\/div>/,
			`<div id="app"${(devServer && 'data-hmr=true') || ''}>${html}</div>`,
		)
		.replace(/(\r\n|\n|\r)/gm, '');

	// Sends the response back to the client
	ctx.body = doc;
};
