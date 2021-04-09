// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	workspaceRoot: false,
	plugins: ['@snowpack/plugin-react-refresh'],
	devOptions: {
		open: 'none',
		hmr: true,
		port: 0,
		output: 'stream',
	},
	buildOptions: {
		watch: true,
	},
	packageOptions: {},
	optimize: {
		bundle: false,
		minify: false,
		target: 'es2020',
	},
};
