import {
	createConfiguration,
	startServer,
	SnowpackUserConfig,
	logger,
} from 'snowpack';

import { join } from 'path';
import { mkdir } from 'fs/promises';
import { performance } from 'perf_hooks';

import Koa from 'koa';
import serve from 'koa-static';
import deepmerge from 'deepmerge';

import * as devConfig from './snowpack.config.js';
import * as prodConfig from './snowpack.config.prod.js';

import { serveHMR } from './hmr';
import { ssr } from './ssr';

// a bit hacky, but simplifies dev code a lot, since we can just reuse the client code here on the server
(global as any).$RefreshReg$ = () => undefined;
(global as any).$RefreshSig$ = () => () => undefined;

logger.level = 'silent';
logger.on('error', e => console.error(e));
logger.on('warn', e => console.error(e));
logger.on('info', e => console.error(e));
logger.on('debug', e => console.error(e));

export interface SnowstormConfig {
	test?: true;
}

const defaultConfig: SnowstormConfig = {};

export const start = async ({
	dev = true,
	path,
	config,
}: {
	dev?: boolean;
	path: string;
	config?: SnowstormConfig;
}) => {
	const serverStart = performance.now();
	const cfg = { ...defaultConfig, ...config };

	const snowpackFolder = join(path, './.snowstorm/snowpack');
	const assetsFolder = join(__dirname, '../../assets');
	const clientFolder = join(__dirname, '../client');

	await mkdir(snowpackFolder, { recursive: true });
	const configOverride: SnowpackUserConfig = {
		buildOptions: {
			out: snowpackFolder,
		},
		mount: {
			[assetsFolder]: '/',
			[clientFolder]: '/dist',
		},
	};

	// await build({
	// 	config: createConfiguration(
	// 		deepmerge(dev ? devConfig : prodConfig, configOverride),
	// 	),
	// 	lockfile: null,
	// });

	const app = new Koa();
	const devServer = await startServer({
		config: createConfiguration(deepmerge(devConfig, configOverride)),
		lockfile: null,
	});

	app.use(serveHMR({ devServer, dev }));
	app.use(serve(join(path, './public'), { index: false }));
	app.use(serve(snowpackFolder, { index: false }));
	app.use(ssr({ devServer, dev, snowpackFolder, config: cfg }));

	app.listen(2000);

	console.log('>> listening on port 2000');
	console.log(`>> started in ${Math.round(performance.now() - serverStart)}ms`);
};
