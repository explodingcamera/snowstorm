import React from 'react';

declare global {
	interface Window {
		__serverdata: Record<string, string>;
	}
}

export interface SSROptionsBuildTime {
	atBuild: true;
	runOnClient: boolean;
}
export interface SSROptionsRunTime {
	atRun: true;
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
	// @ts-expect-error import.meta.env.SSR exists in the environments expected to use this package
	if (import.meta.env.SSR) {
		run()
			.then(res => {
				window.__serverdata[name] = JSON.stringify(res);
			})
			.catch(e => {
				throw new Error(e);
			});
	}

	function useSP(): T | undefined | null {
		const serverdata = window?.__serverdata[name];
		if (serverdata) {
			try {
				const parsedData: T = JSON.parse(serverdata);
				return parsedData;
			} catch (error: unknown) {}
		}

		// @ts-expect-error import.meta.env.SSR exists in the environments expected to use this package
		if (!import.meta.env.SSR && options.runOnClient) {
			// TODO: run on client
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
