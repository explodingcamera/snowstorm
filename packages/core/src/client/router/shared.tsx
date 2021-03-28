import { FunctionComponent } from 'react';

export type AllRoutes = {
	_error: () => SnowstormCustomError;
	_app: () => SnowstormCustomApp | undefined;
} & Record<string, () => Promise<Record<string, SnowstormPage>>>;

export interface SnowstormPage extends FunctionComponent {}
export interface SnowstormCustomError extends FunctionComponent {}
export interface SnowstormCustomApp extends FunctionComponent {}
export interface SnowstormRoute {
	path: string;
	page: string;
}
export const calculateRoutes = (allRoutes: AllRoutes): SnowstormRoute[] =>
	Object.keys(allRoutes)
		.filter(k => !k.startsWith('_'))
		.map(processPage)
		.sort(file => (file.parts.slice(-1)[0].startsWith(':') ? 1 : -1));

const processPage = (page: string) => {
	const parts = page.split('/').map(part => {
		if (part === 'index') return '';
		if (part.startsWith('[') && part.endsWith(']'))
			return ':' + part.replace(/^\[|\]$/g, '');
		return part;
	});

	return {
		path: `/${parts.join('/').replace(/\/$/g, '')}`,
		page,
		parts,
	};
};
