// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		public: '/',
		src: '/dist',
	},
	plugins: ['@snowpack/plugin-react-refresh'],
	devOptions: { open: 'none' },
	packageOptions: {},
	buildOptions: {
		out: 'dist',
	},
	optimize: {
		bundle: true,
		minify: true,
		target: 'es2019',
	},
};
