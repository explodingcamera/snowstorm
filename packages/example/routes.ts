import { SnowstormRoutesConfig } from '@snowstorm/core/types';

export const Routes: SnowstormRoutesConfig = {
	customRoutes: {
		'/:lol': {
			page: '[lol]',
			exportParams: async () => [['ha'], ['haha']],
		},
	},
};
