import type { FunctionComponent } from 'react';

export type Pages = {
	_error: () => SnowstormCustomError;
	_app: () => SnowstormCustomApp | undefined;
} & Record<string, () => Promise<Record<string, SnowstormPage>>>;

export type SnowstormPage = FunctionComponent;
export type SnowstormCustomError = FunctionComponent<{ status?: number }>;

export interface SnowstormCustomAppProps {
	exports?: Record<string, any>;
	status?: number;
	children: React.ReactNode;
}
export type SnowstormCustomApp = FunctionComponent<SnowstormCustomAppProps>;

export interface SnowstormRoute {
	path: string;
	page: string;
	parts: string[];
}
