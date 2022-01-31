/**
 * Important:
 * This is a very basic port to typescript. Expecially this file needs more love.
 * Since the included types weren't 100% compatible with the actual source, a lot of any's are (ab)used
 */

import locationHook, {
	HookNavigationOptions,
	BaseLocationHook,
	HookReturnValue,
	LocationHook,
} from './use-location.js';

import makeMatcher, {
	Path,
	Match,
	MatcherFn,
	DefaultParams,
} from './matcher.js';

import {
	FC,
	useRef,
	Fragment,
	ReactNode,
	useContext,
	useCallback,
	cloneElement,
	ReactElement,
	createContext,
	ComponentType,
	isValidElement,
	useLayoutEffect,
	PropsWithChildren,
	AnchorHTMLAttributes,
	createElement as h,
} from 'react';

// re-export types from these modules
export * from './matcher.js';
export * from './use-location.js';

export type ExtractRouteOptionalParam<PathType extends Path> =
	PathType extends `${infer Param}?`
		? { [k in Param]: string | undefined }
		: PathType extends `${infer Param}*`
		? { [k in Param]: string | undefined }
		: PathType extends `${infer Param}+`
		? { [k in Param]: string }
		: { [k in PathType]: string };

export type ExtractRouteParams<PathType extends string> =
	string extends PathType
		? { [k in string]: string }
		: PathType extends `${infer _Start}:${infer ParamWithOptionalRegExp}/${infer Rest}`
		? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
			? ExtractRouteOptionalParam<Param> & ExtractRouteParams<Rest>
			: ExtractRouteOptionalParam<ParamWithOptionalRegExp> &
					ExtractRouteParams<Rest>
		: PathType extends `${infer _Start}:${infer ParamWithOptionalRegExp}`
		? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
			? ExtractRouteOptionalParam<Param>
			: ExtractRouteOptionalParam<ParamWithOptionalRegExp>
		: Record<string, string>; // this any was `unknown` but this will cause errors down below

/*
 * Components: <Route />
 */

export interface RouteComponentProps<T extends DefaultParams = DefaultParams> {
	params: T;
}

export interface RouteProps<
	T extends DefaultParams | undefined = undefined,
	RoutePath extends Path = Path,
> {
	children?:
		| ((
				params: T extends DefaultParams ? T : ExtractRouteParams<RoutePath>,
		  ) => ReactNode)
		| ReactNode;
	path?: RoutePath;
	component?: ComponentType<
		RouteComponentProps<
			T extends DefaultParams ? T : ExtractRouteParams<RoutePath>
		>
	>;
}

/*
 * Components: <Link /> & <Redirect />
 */

export type NavigationalProps<H extends BaseLocationHook = LocationHook> = (
	| { to: Path; href?: never }
	| { href: Path; to?: never }
) &
	HookNavigationOptions<H>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type LinkProps<H extends BaseLocationHook = LocationHook> = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	'href'
> &
	NavigationalProps<H>;

export type RedirectProps<H extends BaseLocationHook = LocationHook> =
	NavigationalProps<H> & {
		children?: never;
	};

/*
 * Components: <Switch />
 */

export interface SwitchProps {
	location?: string;
	children: Array<ReactElement<RouteProps>>;
}

/*
 * Components: <Router />
 */

export interface RouterProps {
	hook: BaseLocationHook;
	base: Path;
	matcher: MatcherFn;
}

/*
 * Hooks
 */

/*
 * Part 1, Hooks API: useRouter, useRoute and useLocation
 */

// one of the coolest features of `createContext`:
// when no value is provided — default object is used.
// allows us to use the router context as a global ref to store
// the implicitly created router (see `useRouter` below)
type RouterCtxType = { v?: ReturnType<typeof buildRouter> };
const RouterCtx = createContext<RouterCtxType>({});

const buildRouter = ({
	hook = locationHook,
	base = '',
	matcher = makeMatcher(),
} = {}) => ({ hook, base, matcher });

export const useRouter = (): RouterProps => {
	const globalRef = useContext(RouterCtx);

	// either obtain the router from the outer context (provided by the
	// `<Router /> component) or create an implicit one on demand.
	return globalRef.v || (globalRef.v = buildRouter());
};

export function useLocation<
	H extends BaseLocationHook = LocationHook,
>(): HookReturnValue<H> {
	const router = useRouter();
	return router.hook(router) as HookReturnValue<H>;
}

export function useRoute<
	T extends DefaultParams | undefined = undefined,
	RoutePath extends Path = Path,
>(
	pattern: RoutePath,
): Match<T extends DefaultParams ? T : ExtractRouteParams<RoutePath>> {
	const [path] = useLocation();
	return useRouter().matcher(pattern, path) as any;
}

// internal hook used by Link and Redirect in order to perform navigation
const useNavigate = (options: any) => {
	const navRef = useRef();
	const [, navigate] = useLocation();

	(navRef.current as any) = () => navigate(options.to || options.href, options);
	return navRef;
};

/*
 * Part 2, Low Carb Router API: Router, Route, Link, Switch
 */

export const Router: FC<
	Partial<RouterProps> & {
		children: ReactNode;
	}
> = props => {
	const ref = useRef<RouterCtxType>();

	// this little trick allows to avoid having unnecessary
	// calls to potentially expensive `buildRouter` method.
	// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
	const value = ref.current || (ref.current = { v: buildRouter(props) });

	return h(RouterCtx.Provider, {
		value,
		children: props.children,
	});
};

export function Route<
	T extends DefaultParams | undefined = undefined,
	RoutePath extends Path = Path,
>({
	path,
	match,
	component,
	children,
}: RouteProps<T, RoutePath> & { match?: any }): ReactElement | null {
	const useRouteMatch = useRoute(path as any);

	// `props.match` is present - Route is controlled by the Switch
	const [matches, params] = match || useRouteMatch;

	if (!matches) return null;

	// React-Router style `component` prop
	if (component) return h(component, { params });

	// support render prop or plain children
	return typeof children === 'function' ? children(params) : children;
}

export function Link<H extends BaseLocationHook = LocationHook>(
	props: PropsWithChildren<LinkProps<H>>,
): ReactElement<any, any> | null {
	const navRef = useNavigate(props);
	const { base } = useRouter();

	let { to, href = to, children, onClick } = props;

	const handleClick = useCallback(
		event => {
			// ignores the navigation when clicked using right mouse button or
			// by holding a special modifier key: ctrl, command, win, alt, shift
			if (
				event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				event.shiftKey ||
				event.button !== 0
			)
				return;

			event.preventDefault();
			(navRef.current as any)?.();
			// eslint-disable-next-line @typescript-eslint/prefer-optional-chain, babel/no-unused-expressions, @typescript-eslint/no-unused-expressions
			onClick && onClick(event);
		},
		// navRef is a ref so it never changes

		[onClick],
	);

	if (!href) href = '';

	// wraps children in `a` if needed
	const extraProps = {
		// handle nested routers and absolute paths
		href: href.startsWith('~') ? href.slice(1) : base + href,
		onClick: handleClick,
		to: null,
	};
	const jsx = isValidElement(children) ? children : h('a', props as any);

	return cloneElement(jsx, extraProps);
}

const flattenChildren = (children: ReactNode): any =>
	Array.isArray(children)
		? [].concat(
				...children.map(c =>
					c && c.type === Fragment
						? flattenChildren(c.props.children)
						: flattenChildren(c),
				),
		  )
		: [children];

export const Switch: FC<SwitchProps> = ({ children, location }) => {
	const { matcher } = useRouter();
	const [originalLocation] = useLocation();

	for (const element of flattenChildren(children)) {
		let match: number | any = 0;

		if (
			isValidElement(element) &&
			// we don't require an element to be of type Route,
			// but we do require it to contain a truthy `path` prop.
			// this allows to use different components that wrap Route
			// inside of a switch, for example <AnimatedRoute />.
			(match = (element.props as any).path
				? matcher((element.props as any).path, location || originalLocation)
				: [true, {}])[0]
		)
			return (cloneElement as any)(element, { match });
	}

	return null;
};

export function Redirect<H extends BaseLocationHook = LocationHook>(
	props: PropsWithChildren<RedirectProps<H>>,
): ReactElement<any, any> | null {
	const navRef = useNavigate(props) as any;

	// empty array means running the effect once, navRef is a ref so it never changes
	useLayoutEffect(() => {
		navRef.current();
	}, []);

	return null;
}

export default useRoute;
