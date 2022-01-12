import { SnowstormConfig } from '@snowstorm/core/server';
import { Plugin as VitePluginFonts } from 'vite-plugin-fonts';
import RollupPluginMdx from '@mdx-js/rollup';

export const Config: SnowstormConfig = {
	site: {
		build: {
			vitePlugins: [
				VitePluginFonts({
					google: {
						families: ['Inter'],
					},
				}),
				RollupPluginMdx({}),
			],
		},
	},
};
