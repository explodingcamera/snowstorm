import { SnowstormConfig } from '@snowstorm/core';
import { VitePluginFonts } from 'vite-plugin-fonts';
import RollupPluginMdx from '@mdx-js/rollup';

import mdxPrism from 'mdx-prism';
import remarkGfm from 'remark-gfm';

export const Config: SnowstormConfig = {
	sites: [
		{
			domain: 'docs.example.com',
			build: { css: { modules: { generateScopedName: 'example' } } },
		},
	],
	site: {
		build: {
			plugins: [
				RollupPluginMdx({
					remarkPlugins: [remarkGfm],
					rehypePlugins: [mdxPrism],
				}),
				VitePluginFonts({
					google: {
						families: ['Inter', 'Space Mono'],
					},
				}),
			],
		},
	},
};
