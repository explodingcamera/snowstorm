import { Middleware } from 'koa';
import { readFile } from 'fs/promises';
import {
	SnowstormConfigInternal,
	SnowstormSiteConfig,
	SnowstormSiteConfigInternal,
} from './config';
import { join } from 'path';
import { ViteDevServer } from 'vite';
import { createRequire } from 'module';
import { checkFileExists } from './utils/file-exists';
const require = createRequire(import.meta.url);

const startDate = Date.now();
const version = startDate.toString();
const ABORT_DELAY = 2000;

let manifest: Record<string, unknown> | undefined;

export const ssr =
	({
		devServer,
		dev,
		site,
		config,
	}: {
		devServer: ViteDevServer;
		dev: boolean;
		site: SnowstormSiteConfigInternal;
		config: SnowstormConfigInternal;
	}): Middleware =>
	async ctx => {
		ctx.status = 200;
		if (!dev) {
			ctx.set('ETag', version);

			if (ctx.fresh) {
				ctx.status = 304;
				return;
			}
		}

		if (!dev && !manifest) {
			const loc = join(site.internal.viteFolder, './client/ssr-manifest.json');
			if (await checkFileExists(loc)) {
				const data = await readFile(loc, 'utf-8');
				try {
					if (!manifest) manifest = JSON.parse(data);
				} catch {}
			}
		}

		let top = '';
		let bottom = '';
		try {
			const ssrModule = dev
				? await devServer.ssrLoadModule('_snowstorm/load-html.js')
				: require(site.internal.viteFolder + '/server/load-html.js');

			const {
				loadPage,
				renderPage,
				serverprops,
				getHead,
				renderToPipeableStream,
			} = ssrModule;

			const page = await loadPage({ path: ctx.path });

			let internalHead = '';
			if (!dev && manifest) {
				internalHead = await collectPreload(page.page, site, manifest);
			}

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
				htmlFile = htmlFile.replace(
					/<!--SNOWSTORM ENTRYPOINT-->[\s\S]*?<!--\/SNOWSTORM ENTRYPOINT-->/,
					`<script type="module" src="${join(
						config.internal.snowstormClientFolder,
						'./index.js',
					)}"></script>`,
				);
				htmlFile = await devServer.transformIndexHtml(ctx.path, htmlFile);
			}

			const props: string = await serverprops.collectProps();
			const head: string = getHead();
			const basePath = site.basePath === '/' ? '' : site.basePath;

			const doc = htmlFile
				.replace(/\/_snowstorm\/index.js/g, `/_snowstorm/index.js?v=${version}`)
				.replace(/\/_snowstorm/g, `${basePath}/_snowstorm`)
				.replace(
					'<!--SNOWSTORM DATA-->',
					props.length
						? `<script id="__serverprops" type="application/json">${props}</script>`
						: '',
				)
				.replace('<!--SNOWSTORM INTERNAL-HEAD-->', internalHead)
				.replace('<!--SNOWSTORM HEAD-->', head);

			ctx.res.socket?.on('error', error => {
				console.error('Fatal', error);
			});

			ctx.respond = false;
			[top, bottom] = doc.split('<!--SNOWSTORM APP-->');

			let didError = false;
			const { pipe, abort } = renderToPipeableStream(reactPage, {
				onCompleteShell() {
					ctx.status = didError ? 500 : 200;
					ctx.res.write(
						top + `<div id="app"${(dev && 'data-hmr=true') || ''}>`,
					);

					pipe(ctx.res);
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

const collectPreload = async (
	page: string,
	site: SnowstormSiteConfig,
	manifest: Record<string, unknown>,
) => {
	const entries = Object.entries(manifest).filter(
		([key]) =>
			key.includes(`/pages/${page}.`) &&
			/.(js|mjs|jsx|ts|tsx|md|mdx)$/.test(key),
	);

	if (!entries.length) return '';
	if (entries.length !== 1) {
		throw new Error(
			'something went wrong while collecting assets for page ' + page,
		);
	}

	return entries[0]
		.map(v => {
			if (!Array.isArray(v) || v.length !== 2) return '';

			return v
				.map((e: unknown) => {
					if (typeof e !== 'string') return '';

					if (e.endsWith('.js'))
						return `<link rel="modulepreload" href="${e}"/>`;
					if (e.endsWith('.css')) return `<link rel="stylesheet" href="${e}"/>`;

					return '';
				})
				.join('');
		})
		.join('');
};
