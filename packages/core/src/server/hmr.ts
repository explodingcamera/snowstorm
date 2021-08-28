import { Middleware } from 'koa';
import { ViteDevServer } from 'vite';
// import { SnowpackDevServer } from 'snowpack';

// export const serveHMR =
// 	({
// 		devServer,
// 		dev,
// 	}: {
// 		devServer: ViteDevServer;
// 		dev: boolean;
// 	}): Middleware =>
// 	async (ctx, next) => {
// 		// serve hmr & dev code in dev mode
// 		if (dev && ctx.path.startsWith('/_snowstorm')) {
// 			// const resp = await devServer.(ctx.path);
// 			if (!resp) return;
// 			ctx.body = resp.contents;
// 			ctx.set('Content-Type', resp.contentType.toString());
// 			return;
// 		}

// 		return next();
// 	};
