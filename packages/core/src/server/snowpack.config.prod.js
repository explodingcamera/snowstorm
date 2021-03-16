// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

const config = require('./snowpack.config');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	...config,
	plugins: [],
	optimize: {
		bundle: true,
		minify: true,
		target: 'es2017',
		splitting: true,
		treeshake: true,
	},
};
