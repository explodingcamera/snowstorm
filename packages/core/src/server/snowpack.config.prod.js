// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

const config = require('./snowpack.config');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	...config,
	plugins: [],
	devOptions: {
		port: 45247,
		hostname: 'localhost', // don't expose the port on production environments
	},
	optimize: { bundle: true, minify: true, target: 'es2017' },
};
