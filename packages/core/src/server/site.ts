import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import compress from 'koa-compress';
import htmlMinify from 'koa-html-minifier';
import chokidar from 'chokidar';

import {
	build,
	createConfiguration,
	SnowpackUserConfig,
	startServer,
} from 'snowpack';
import * as devConfig from './snowpack.config.js';
import * as prodConfig from './snowpack.config.prod.js';

import { SnowstormConfigInternal, SnowstormInternalSiteConfig } from './config';

import { join } from 'path';
import glob from 'glob-promise';
import deepmerge from 'deepmerge';
import { mkdir } from 'fs/promises';

import { getFreePort } from './utils/free-port';
import { brotliify } from './utils/brotliify';

import { ssr } from './ssr';
import { serveHMR } from './hmr';
import { generateRouter, pagePattern } from './router';

export const startSite = async (
	dev: boolean,
	config: SnowstormConfigInternal,
	site: SnowstormInternalSiteConfig,
): Promise<Koa> => {
	if (dev) site.basePath = '/';
	const hmrPort = (dev && (await getFreePort())) || 0;

	const { snowstormAssetsFolder, snowstormClientFolder } = config.internal;

	const configOverride: SnowpackUserConfig = {
		buildOptions: {
			out: site.internal.snowpackFolder,
			metaUrlPath: '_snowstorm',
		},
		devOptions: {
			hmrPort,
		},
		mount: {
			[snowstormAssetsFolder]: `/`,
			[site.internal.pagesFolder]: `/_snowstorm/pages`,
			[snowstormClientFolder]: `/_snowstorm/internal`,
			[site.internal.internalFolder]: `/_snowstorm/internal`,
		},
	};

	const internalFolderReady = mkdir(site.internal.internalFolder, {
		recursive: true,
	});

	const genRoutes = async () => {
		await internalFolderReady;
		return generateRouter({
			template: join(__dirname, '../assets/routes.js.template'),
			site,
			config,
		});
	};

	const routesDone = genRoutes();
	const snowpackConfig = createConfiguration(
		deepmerge(dev ? devConfig : prodConfig, configOverride),
	);

	// important! no leading slashes: https://github.com/snowpackjs/snowpack/issues/3111#issuecomment-816578171
	snowpackConfig.buildOptions.baseUrl = '';

	if (!dev) {
		await routesDone;
		await build({
			config: snowpackConfig,
			lockfile: null,
		});

		const files = await glob(`${site.internal.snowpackFolder}/**/*`, {
			nodir: true,
		});

		brotliify(files);
	}

	const app = new Koa();
	const [devServer] = await Promise.all([
		startServer(
			{
				config: snowpackConfig,
				lockfile: null,
			},
			{ isDev: dev, isWatch: dev },
		),
		routesDone,
	]);

	app.use(serveHMR({ devServer, dev }));
	app.use(
		serve(join(site.internal.staticFolder, './public'), { index: false }),
	);
	app.use(serve(config.internal.snowstormAssetsFolder, { index: false }));
	app.use(
		mount(
			serve(site.internal.snowpackFolder, {
				index: false,
				maxAge: dev ? undefined : 31536000,
			}),
		),
	);

	if (!dev) {
		app.use(compress());
		app.use(
			htmlMinify({
				collapseWhitespace: true,
			}),
		);
	}

	app.use(
		ssr({
			devServer,
			dev,
			config,
			site,
		}),
	);

	if (dev) {
		const watcher = chokidar.watch(
			join(site.internal.pagesFolder, pagePattern),
			{
				ignoreInitial: true,
			},
		);

		const listener = async (path: string) =>
			genRoutes()
				.then(() => console.log('successfully updated routes', path))
				.catch(e => console.error(`error updating routes: `, e));

		watcher.on('add', listener);
		watcher.on('remove', listener);
	}

	const server = new Koa();
	server.use(mount(site.basePath, app));
	return server;
};
