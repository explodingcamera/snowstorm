import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';
import { readFile } from 'fs/promises';
import { SnowstormInternalSiteConfig } from './config';
import { join } from 'path';
import serve from 'koa-static';

const startDate = Date.now();
const version = startDate.toString();
const ABORT_DELAY = 2000;

let cachedHtml: string;
export const ssr =
	({
		devServer,
		dev,
		site,
	}: {
		devServer: SnowpackDevServer;
		dev: boolean;
		site: SnowstormInternalSiteConfig;
	}): Middleware =>
	async (ctx, next) => {
		if (
			ctx.path.startsWith('/_snowstorm') ||
			ctx.path.startsWith('/favicon.ico')
		) {
			serve(site.internal.snowpackFolder)(ctx, next);
			return;
		}

		ctx.status = 200;
		if (!dev) {
			ctx.set('ETag', version);

			if (ctx.fresh) {
				ctx.status = 304;
				return;
			}
		}

		try {
			const {
				loadPage,
				renderPage,
				processSPs,
				collectProps,
				getHead,
				pipeToNodeWritable,
			} = (
				await devServer
					.getServerRuntime()
					.importModule('/_snowstorm/internal/load-html.js')
			).exports;

			const page = await loadPage({ path: ctx.path });

			await processSPs();
			const reactPage: string = await renderPage({
				...page,
				path: ctx.path,
			});

			// Load contents of index.html
			let htmlFile: string;
			if (dev) {
				htmlFile = (await devServer.loadUrl('/'))?.contents.toString() ?? '';
			} else if (!dev && cachedHtml) {
				htmlFile = cachedHtml;
			} else {
				htmlFile = await readFile(
					join(site.internal.snowpackFolder, './index.html'),
					'utf8',
				);
			}

			const props: string = await collectProps();
			const head: string = getHead();
			const basePath = site.basePath === '/' ? '' : site.basePath;

			const doc = htmlFile
				.replace(/\/_snowstorm\/index.js/g, `/_snowstorm/index.js?v=${version}`)
				.replace(/\/_snowstorm/g, `${basePath}/_snowstorm`)
				.replace(
					'{{SNOWPACK DATA}}',
					props.length
						? `<script id="__serverprops" type="application/json">${props}</script>`
						: '',
				)
				.replace('{{SNOWPACK HEAD}}', head);

			ctx.res.socket?.on('error', error => {
				console.error('Fatal', error);
			});

			ctx.respond = false;

			const { startWriting, abort } = pipeToNodeWritable(reactPage, ctx.res, {
				onReadyToStream() {
					// If something errored before we started streaming, we set the error code appropriately.
					const [top, bottom] = doc.split('{{SNOWPACK APP}}');

					ctx.res.write(
						top + `\n<div id="app"${(dev && 'data-hmr=true') || ''}>`,
					);

					startWriting();
					ctx.res.write('</div>\n' + bottom);
				},
				onError(_: unknown) {
					ctx.status = 500;
					throw new Error();
				},
			});
			// Abandon and switch to client rendering if enough time passes.
			// Try lowering this to see the client recover.
			setTimeout(abort as () => void, ABORT_DELAY);
		} catch (error: unknown) {
			if (!(error instanceof Error)) return;
			error.stack = error.stack?.replaceAll(
				'/_snowstorm/pages',
				site.internal.pagesFolder,
			);
			site.internal.log.error(error.name, error.message, error.stack);
			ctx.status = 500;
		}
	};
