import { Middleware } from 'koa';
// import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormConfigInternal, SnowstormInternalSiteConfig } from './config';
import { join } from 'path';
import serve from 'koa-static';
import { ViteDevServer } from 'vite';

const startDate = Date.now();
const version = startDate.toString();
const ABORT_DELAY = 2000;

export const ssr =
	({
		devServer,
		dev,
		site,
		config,
	}: {
		devServer: ViteDevServer;
		dev: boolean;
		site: SnowstormInternalSiteConfig;
		config: SnowstormConfigInternal;
	}): Middleware =>
	async (ctx, next) => {
		ctx.status = 200;
		if (!dev) {
			ctx.set('ETag', version);

			if (ctx.fresh) {
				ctx.status = 304;
				return;
			}
		}

		let top = '';
		let bottom = '';
		try {
			const ssrModule = await devServer.ssrLoadModule(
				'_snowstorm/load-html.js',
			);

			const { loadPage, renderPage, serverprops, getHead, pipeToNodeWritable } =
				ssrModule;

			const page = await loadPage({ path: ctx.path });

			await serverprops.processSPs();
			const reactPage: string = await renderPage({
				...page,
				path: ctx.path,
			});

			// Load contents of index.html
			let htmlFile = await readFile(
				join(config.internal.snowstormAssetsFolder, './index.html'),
				'utf8',
			);

			htmlFile = await devServer.transformIndexHtml(ctx.path, htmlFile);

			const props: string = await serverprops.collectProps();
			const head: string = getHead();
			const basePath = site.basePath === '/' ? '' : site.basePath;

			const doc = htmlFile
				.replace(/\/_snowstorm\/index.js/g, `/_snowstorm/index.js?v=${version}`)
				.replace(/\/_snowstorm/g, `${basePath}/_snowstorm`)
				.replace(
					'{{SNOWSTORM DATA}}',
					props.length
						? `<script id="__serverprops" type="application/json">${props}</script>`
						: '',
				)
				.replace('{{SNOWSTORM HEAD}}', head);

			ctx.res.socket?.on('error', error => {
				console.error('Fatal', error);
			});

			ctx.respond = false;
			[top, bottom] = doc.split('{{SNOWSTORM APP}}');
			const { startWriting, abort } = pipeToNodeWritable(reactPage, ctx.res, {
				onReadyToStream() {
					// If something errored before we started streaming, we set the error code appropriately.

					ctx.res.write(
						top + `\n<div id="app"${(dev && 'data-hmr=true') || ''}>`,
					);

					startWriting();
					ctx.res.write('</div>\n' + bottom);
				},
				onError(error: unknown) {
					if (!(error instanceof Error)) return;
					devServer.ssrFixStacktrace(error);
					ctx.status = 500;
					console.log('err');
				},
			});
			// Abandon and switch to client rendering if enough time passes.
			setTimeout(abort as () => void, ABORT_DELAY);
		} catch (error: unknown) {
			if (!(error instanceof Error)) return;
			devServer.ssrFixStacktrace(error);

			error.stack = error.stack?.replaceAll(
				'/_snowstorm/pages',
				site.internal.pagesFolder,
			);
			site.internal.log.error(error.name, error.message, error.stack);
			ctx.status = 500;
		}
	};
