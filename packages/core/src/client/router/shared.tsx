import { FunctionComponent } from 'react';

export type Pages = {
	_error: () => SnowstormCustomError;
	_app: () => SnowstormCustomApp | undefined;
} & Record<string, () => Promise<Record<string, SnowstormPage>>>;

export interface SnowstormPage extends FunctionComponent {}
export interface SnowstormCustomError extends FunctionComponent {}
export interface SnowstormCustomApp extends FunctionComponent {}
export interface SnowstormRoute {
	path: string;
	page: string;
	parts: string[];
}
