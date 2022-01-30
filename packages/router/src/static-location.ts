import { Path } from './index.js';
import { LocationHook } from './use-location.js';

interface StaticLocationHookOptions {
	record?: boolean;
}

interface StaticLocationHook extends LocationHook {
	history: Readonly<Path[]>;
}

// Generates static `useLocation` hook. The hook always
// responds with initial path provided.
// You can use this for server-side rendering.
export default (
	path: Path = '/',
	{ record = false }: StaticLocationHookOptions = {},
): StaticLocationHook => {
	let hook: any;
	const navigate = (to: string, { replace }: { replace?: boolean } = {}) => {
		if (record) {
			if (replace) {
				hook.history.pop();
			}

			hook.history.push(to);
		}
	};

	hook = () => [path, navigate];
	hook.history = [path];
	return hook;
};
