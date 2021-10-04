import { Middleware } from 'koa';
import { readFile } from 'fs/promises';
import { SnowstormConfigInternal, SnowstormInternalSiteConfig } from './config';
import { join } from 'path';
import { ViteDevServer } from 'vite';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
			const ssrModule = dev
				? await devServer.ssrLoadModule('_snowstorm/load-html.js')
				: // eslint-disable-next-line @typescript-eslint/no-require-imports
				  require(site.internal.viteFolder + '/server/load-html.js');

			const { loadPage, renderPage, serverprops, getHead, pipeToNodeWritable } =
				ssrModule;

			const page = await loadPage({ path: ctx.path });

			await serverprops.processSPs();
			const reactPage: string = await renderPage({
				...page,
				path: ctx.path,
			});

			const indexHTML = dev
				? join(config.internal.snowstormAssetsFolder, './index.html')
				: join(site.internal.viteFolder, './client/index.html');

			// Load contents of index.html
			let htmlFile = await readFile(indexHTML, 'utf8');

			if (dev) {
				htmlFile = await devServer.transformIndexHtml(ctx.path, htmlFile);
			}

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

			let didError = false;
			const { startWriting, abort } = pipeToNodeWritable(reactPage, ctx.res, {
				onCompleteShell() {
					ctx.status = didError ? 500 : 200;
					ctx.res.write(
						top + `<div id="app"${(dev && 'data-hmr=true') || ''}>`,
					);

					startWriting();
					ctx.res.write('</div>' + bottom);
				},
				onError(error: unknown) {
					config.internal.log.error(error);
					if (!(error instanceof Error)) return;
					devServer.ssrFixStacktrace(error);
					didError = true;
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

		ctx.set('Content-Type', 'text/html; charset=UTF-8');
	};
