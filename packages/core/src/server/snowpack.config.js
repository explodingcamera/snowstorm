// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	plugins: ['@snowpack/plugin-react-refresh'],
	devOptions: {
		open: 'none',
		hmr: true,
		hmrPort: 45246,
		port: 45247,
		output: 'stream',
	},
	packageOptions: {},
	optimize: {
		bundle: false,
		minify: false,
		target: 'es2020',
	},
};
