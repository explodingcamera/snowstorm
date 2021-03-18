import { useLocation } from 'wouter';

export const useRouter = () => {
	const [location, setLocation] = useLocation();

	return {
		pathname: location,
		asPath: location,
		query: {},
		basePath: undefined,
		isFallback: false,
		isReady: true,
		isPreview: false,
		push: (url: string, _as: string, _options: Record<string, unknown>) =>
			setLocation(url, {}),
		replace: (url: string, _as: string, _options: Record<string, unknown>) =>
			setLocation(url, { replace: true }),
		prefetch: (url: string) => undefined,
		reload: () => window.location.reload(),
	};
};
