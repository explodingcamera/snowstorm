import type { SnowstormConfig } from '@snowstorm/core/server';

export const Config: SnowstormConfig = {
	development: {
		port: 2020,
	},
	site: {
		basePath: '/',
		routes: {
			customRoutes: {
				'/:lol': {
					page: '[lol]',
					exportParams: async () => [['ha'], ['haha']],
				},
			},
		},
	},
};
