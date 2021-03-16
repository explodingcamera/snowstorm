import React, { FunctionComponent } from 'react';

// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
import { routes as defaultRoutes } from './internal/routes.js';

interface SnowstormPage extends FunctionComponent {}
interface SnowstormCustomError extends FunctionComponent {}
interface SnowstormCustomApp extends FunctionComponent {}

const capitalize = (string: string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

export const loadPage = async () => {
	const CustomError: SnowstormCustomError = defaultRoutes._error();
	const CustomApp: SnowstormCustomApp | undefined = defaultRoutes._app();

	let Page: SnowstormPage;
	try {
		const currentPage = 'index';
		const pageExports = await defaultRoutes[currentPage]();

		Page =
			pageExports.default ||
			pageExports[capitalize(currentPage)] ||
			(() => <CustomError />);
	} catch (error: unknown) {
		Page = () => <CustomError />;
	}

	let Component: React.FC = () => <Page />;
	if (CustomApp) {
		Component = () => (
			<CustomApp>
				<Page />
			</CustomApp>
		);
	}

	return Component;
};
