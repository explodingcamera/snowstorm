import { SnowstormConfig } from '@snowstorm/core/server';
import { Plugin as VitePluginFonts } from 'vite-plugin-fonts';
import RollupPluginMdx from '@mdx-js/rollup';

import mdxPrism from 'mdx-prism';
import remarkGfm from 'remark-gfm';

export const Config: SnowstormConfig = {
	site: {
		build: {
			vitePlugins: [
				VitePluginFonts({
					google: {
						families: ['Inter', 'Space Mono'],
					},
				}),
				RollupPluginMdx({
					remarkPlugins: [remarkGfm],
					rehypePlugins: [mdxPrism],
				}),
			],
		},
	},
};
