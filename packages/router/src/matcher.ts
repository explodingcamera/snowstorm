export type Path = string;
export type DefaultParams = Record<string, Path>;
export type Params<T extends DefaultParams = DefaultParams> = T;

export type MatchWithParams<T extends DefaultParams = DefaultParams> = [
	true,
	Params<T>,
];
export type NoMatch = [false, null];
export type Match<T extends DefaultParams = DefaultParams> =
	| MatchWithParams<T>
	| NoMatch;

export type MatcherFn = (pattern: Path, path: Path) => Match;
export interface PatternToRegexpResult {
	keys: Array<{ name: string | number }>;
	regexp: RegExp;
}

// creates a matcher function
export default function makeMatcher(
	makeRegexpFn: (pattern: string) => PatternToRegexpResult = pathToRegexp,
): MatcherFn {
	const cache: Record<string, PatternToRegexpResult> = {};

	// obtains a cached regexp version of the pattern
	const getRegexp = (pattern: string) =>
		cache[pattern] || (cache[pattern] = makeRegexpFn(pattern));

	return (pattern: string, path: string) => {
		const { regexp, keys } = getRegexp(pattern || '');
		const out = regexp.exec(path);
		if (!out) return [false, null];

		// formats an object with matched params
		const params: Params = keys.reduce((params: Params, key, i) => {
			params[key.name] = out[i + 1];
			return params;
		}, {});

		return [true, params];
	};
}

// escapes a regexp string (borrowed from path-to-regexp sources)
// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202
const escapeRx = (str: string) =>
	str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

// returns a segment representation in RegExp based on flags
// adapted and simplified version from path-to-regexp sources
const rxForSegment = (repeat: boolean, optional: boolean, prefix: boolean) => {
	let capture = repeat ? '((?:[^\\/]+?)(?:\\/(?:[^\\/]+?))*)' : '([^\\/]+?)';
	if (optional && prefix) capture = '(?:\\/' + capture + ')';
	return capture + (optional ? '?' : '');
};

const pathToRegexp = (pattern: string) => {
	const groupRx = /:([A-Za-z0-9_]+)([?+*]?)/g;

	let match = null;
	let lastIndex = 0;
	const keys = [];
	let result = '';

	while ((match = groupRx.exec(pattern)) !== null) {
		const [, segment, mod] = match;

		// :foo  [1]      (  )
		// :foo? [0 - 1]  ( o)
		// :foo+ [1 - ∞]  (r )
		// :foo* [0 - ∞]  (ro)
		const repeat = mod === '+' || mod === '*';
		const optional = mod === '?' || mod === '*';
		const prefix = optional && pattern[match.index - 1] === '/' ? 1 : 0;

		const prev = pattern.substring(lastIndex, match.index - prefix);

		keys.push({ name: segment });
		lastIndex = groupRx.lastIndex;

		result += escapeRx(prev) + rxForSegment(repeat, optional, Boolean(prefix));
	}

	result += escapeRx(pattern.substring(lastIndex));
	return { keys, regexp: new RegExp('^' + result + '(?:\\/)?$', 'i') };
};
