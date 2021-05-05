import { SnowstormConfig } from '@snowstorm/core/server';

export const Config: SnowstormConfig = {
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
