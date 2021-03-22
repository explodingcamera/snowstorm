import React from 'react';
import { getServerProp, registerSP } from './internal';

export interface SSROptionsBuildTime {
	type: 'dynamic';
	runOnClient: boolean;
}
export interface SSROptionsRunTime {
	type: 'static';
	runOnClient: boolean;
}

export type SPOptions = SSROptionsBuildTime | SSROptionsRunTime;

export interface SSRHocProps<T> {
	ssr: T;
}

export function createSP<T>(
	name: string,
	run: () => Promise<T>,
	options: SPOptions,
) {
	registerSP(name, run, options);

	function useSP(): T | undefined | null {
		const serverdata: T = getServerProp(name);
		if (serverdata) return serverdata;

		// @ts-expect-error import.meta.env.SSR exists in the environments expected to use this package
		if (!import.meta.env.SSR && options.runOnClient) {
			// TODO: run on client
			// we should maybe run this outside of react, like we do on the server?
			return null; // indicate we're loading data
		}

		return undefined;
	}

	function withSP<P extends SSRHocProps<T>, T>(
		Component: React.ComponentType<P>,
	): React.ComponentType<P> {
		return props => {
			const ssr = useSP();
			return <Component {...props} ssr={ssr} />;
		};
	}

	return { useSP, withSP };
}
