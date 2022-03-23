export { Head } from '@snowstorm/head';
import { Link, useRoute, useLocation, Router } from '@snowstorm/router';
export { Link, useRoute, useLocation, Router };

import {
	SnowstormConfig as _SnowstormConfig,
	SnowstormSiteConfig as _SnowstormSiteConfig,
	SnowstormExportConfig as _SnowstormExportConfig,
	SnowstormMultiSiteConfig as _SnowstormMultiSiteConfig,
	SnowstormBuildOptions as _SnowstormBuildOptions,
} from './server/config';

export type SnowstormConfig = _SnowstormConfig;
export type SnowstormSiteConfig = _SnowstormSiteConfig;
export type SnowstormExportConfig = _SnowstormExportConfig;
export type SnowstormMultiSiteConfig = _SnowstormMultiSiteConfig;
export type SnowstormBuildOptions = _SnowstormBuildOptions;
