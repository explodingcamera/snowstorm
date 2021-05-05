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
import { prodConfig, devConfig } from './snowpack-config';

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

const createSnowstormConfig = async ({
	dev,
	config,
	site,
}: {
	dev: boolean;
	config: SnowstormConfigInternal;
	site: SnowstormInternalSiteConfig;
}) => {
	const hmrPort = (dev && (await getFreePort())) || 0;
	const { snowstormAssetsFolder, snowstormClientFolder } = config.internal;

	const configOverride: SnowpackUserConfig = {
		root: config.internal.rootFolder,
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

	if (site.build.sass) {
		configOverride.plugins?.push([
			'@snowpack/plugin-sass',
			typeof site.build.sass === 'object' ? site.build.sass : {},
		]);
	}

	if (site.build.postcss) {
		configOverride.plugins?.push([
			'@snowpack/plugin-postcss',
			typeof site.build.postcss === 'object' ? site.build.postcss : {},
		]);
	}

	const snowpackConfig = createConfiguration(
		deepmerge(dev ? devConfig : prodConfig, configOverride),
	);

	return snowpackConfig;
};

export const startSite = async ({
	dev,
	config,
	site,
}: {
	dev: boolean;
	config: SnowstormConfigInternal;
	site: SnowstormInternalSiteConfig;
}): Promise<Koa> => {
	if (dev) site.basePath = '/';

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
	const snowpackConfig = await createSnowstormConfig({ dev, config, site });

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
