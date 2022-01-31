import { useEffect, useRef, useState, useCallback } from 'react';

export type LocationTuple = HookReturnValue<LocationHook>;
type Path = string;
// the base useLocation hook type. Any custom hook (including the
// default one) should inherit from it.
export type BaseLocationHook = (
	...args: any[]
) => [Path, (path: Path, ...args: any[]) => any];

// Returns the type of the location tuple of the given hook.
export type HookReturnValue<H extends BaseLocationHook> = ReturnType<H>;

// Returns the type of the navigation options that hook's push function accepts.
export type HookNavigationOptions<H extends BaseLocationHook> =
	HookReturnValue<H>[1] extends (
		path: Path,
		options: infer R,
		...rest: any[]
	) => any
		? R extends Record<string, any>
			? R
			: Record<string, unknown>
		: Record<string, unknown>;

const location = global.location || { pathname: '/' };

/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */
const eventPopstate = 'popstate';
const eventPushState = 'pushState';
const eventReplaceState = 'replaceState';
export const events = [eventPopstate, eventPushState, eventReplaceState];

export type LocationHook = (options?: {
	base?: Path;
}) => [Path, (to: Path, options?: { replace?: boolean }) => void];

interface LocationState {
	path: string;
	search: string;
}

const useLocation: LocationHook = ({ base = '' } = {}) => {
	const [{ path, search }, update] = useState<LocationState>(() => ({
		path: currentPathname(base),
		search: location.search,
	})); // @see https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
	const prevHash = useRef(path + search);

	useEffect(() => {
		// this function checks if the location has been changed since the
		// last render and updates the state only when needed.
		// unfortunately, we can't rely on `path` value here, since it can be stale,
		// that's why we store the last pathname in a ref.
		const checkForUpdates = () => {
			const pathname = currentPathname(base);
			const { search } = location;
			const hash = pathname + search;

			if (prevHash.current !== hash) {
				prevHash.current = hash;
				update({ path: pathname, search });
			}
		};

		events.forEach(e => window.addEventListener(e, checkForUpdates));

		// it's possible that an update has occurred between render and the effect handler,
		// so we run additional check on mount to catch these updates. Based on:
		// https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
		checkForUpdates();

		return () =>
			events.forEach(e => window.removeEventListener(e, checkForUpdates));
	}, [base]);

	// the 2nd argument of the `useLocation` return value is a function
	// that allows to perform a navigation.
	//
	// the function reference should stay the same between re-renders, so that
	// it can be passed down as an element prop without any performance concerns.
	const navigate = useCallback(
		(to: Path, { replace = false } = {}) =>
			history[replace ? eventReplaceState : eventPushState](
				null,
				'',
				// handle nested routers and absolute paths
				to.startsWith('~') ? to.slice(1) : base + to,
			),
		[base],
	);

	return [path, navigate];
};

export default useLocation;

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof history !== 'undefined') {
	const methods: ['pushState', 'replaceState'] = [
		eventPushState,
		eventReplaceState,
	];
	for (const type of methods) {
		const original = history[type];

		history[type] = function () {
			// eslint-disable-next-line prefer-rest-params
			const result = (original as any).apply(this, arguments);
			const event = new window.Event(type, {
				bubbles: true,
				cancelable: false,
			});
			// eslint-disable-next-line prefer-rest-params
			(event as any).arguments = arguments;

			window.dispatchEvent(event);
			return result;
		};
	}
}

const currentPathname = (base: string, path = location.pathname) =>
	path.toLowerCase().indexOf(base.toLowerCase())
		? '~' + path
		: path.slice(base.length) || '/';
