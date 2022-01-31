import { Middleware } from 'koa';
import { readFile } from 'fs/promises';
import { SnowstormConfigInternal, SnowstormSiteConfigInternal } from './config';
import { join } from 'path';
import { ViteDevServer } from 'vite';
import { checkFileExists } from './utils/file-exists';
import { modules } from './site';
import { fileIsPage } from './utils/is-page';
import Youch from '@explodingcamera/youch';

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

		let manifest: Record<string, string[]> | undefined;
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
			(global as any).___snowstorm_collect_modules = [];

			const ssrModule = dev
				? await devServer.ssrLoadModule('_snowstorm/load-html.js')
				: await import(site.internal.viteFolder + '/server/load-html.js');

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
				internalHead = await collectPreload(page.page, site, config, manifest);
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
					throw error;
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

			error.stack = error.stack?.replaceAll(
				'_snowstorm/',
				'file://' + config.internal.snowstormClientFolder + '/',
			);

			error.stack = error.stack
				?.replace('    at eval (', `    at eval (${config.internal.rootFolder}`)
				.replaceAll(`/@fs/`, 'file:///');

			site.internal.log.error(
				'SSR error:',
				error.name,
				error.message,
				error.stack,
			);

			if (dev) {
				const youch = new Youch(error, ctx.req);
				const html = await youch.toHTML();
				ctx.res.write(html);
				ctx.status = 200;
			} else {
				ctx.status = 500;
			}
		}

		ctx.set('Content-Type', 'text/html; charset=UTF-8');
	};

const collectPreload = async (
	page: string,
	site: SnowstormSiteConfigInternal,
	config: SnowstormConfigInternal,
	manifest: Record<string, string[]>,
) => {
	const children = modules
		.filter(m => m.id.includes(`${site.internal.baseFolder}/pages/${page}`))
		.map(m => ({
			id: m.id,
			dependencies: m.dependencies
				.filter(d => d.startsWith(config.internal.rootFolder))
				.map(d => d.replace(config.internal.rootFolder, '')),
		}))?.[0]?.dependencies;

	const entries: string[] = Object.entries(manifest)
		.filter(([key]) => {
			const isPage = key.includes(`/pages/${page}.`) && fileIsPage(key);
			const isDep = children?.some(c => key.includes(c)) || false;
			return isPage || isDep;
		})
		.map(x => x[1])
		.flat();

	const preload = [...new Set(entries)];

	const html = preload
		.map(v => {
			if (v.endsWith('.js')) return `<link rel="modulepreload" href="${v}"/>`;
			if (v.endsWith('.css')) return `<link rel="stylesheet" href="${v}"/>`;
			return '';
		})
		.join('\n');

	return html;
};
