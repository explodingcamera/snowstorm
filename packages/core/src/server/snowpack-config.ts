// // Snowpack Configuration File
// // See all supported options: https://www.snowpack.dev/reference/configuration

// import { SnowpackUserConfig } from 'snowpack';

// export const devConfig: SnowpackUserConfig = {
// 	workspaceRoot: undefined,
// 	plugins: [require.resolve('@snowpack/plugin-react-refresh')],
// 	devOptions: {
// 		open: 'none',
// 		hmr: true,
// 		port: 0,
// 		output: 'stream',
// 	},
// 	buildOptions: {
// 		watch: true,
// 		sourcemap: 'inline',
// 	},
// 	packageOptions: {
// 		polyfillNode: true,
// 	},
// 	optimize: {
// 		bundle: false,
// 		minify: false,
// 		target: 'es2020',
// 	},
// };

// export const prodConfig: SnowpackUserConfig = {
// 	...devConfig,
// 	plugins: [],
// 	devOptions: {
// 		port: 0,
// 		hmr: false,
// 	},
// 	buildOptions: {
// 		ssr: true,
// 		watch: false,
// 		sourcemap: 'inline',
// 	},
// 	optimize: {
// 		bundle: true,
// 		minify: true,
// 		target: 'es2017',
// 		splitting: true,
// 		treeshake: true,
// 	},
// };
