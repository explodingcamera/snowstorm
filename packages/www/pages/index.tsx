import type { PageMeta } from '../types';

import styles from './index.module.scss';
import Logo from './../assets/logo.svg';

import { Link } from '@snowstorm/core';

export const meta: PageMeta = {
	disableSidebar: true,
	wrapperClassName: styles.wrapper,
};

export const Index = () => (
	<>
		<div className={styles.logo}>
			<img width="100" height="100" src={Logo} />
			<h1>Snowstorm</h1>
		</div>
		<h1>The lightning-fast and minimalist React Framework</h1>
		<br />

		<h2>What?</h2>
		<br />
		<p>
			Snowstorm (beta) is a Framework and Static-Site-Generator for react, which
			handles the heavy lifting involved with shipping a react project so you
			can focus on creating awesome things!
		</p>
		<h2>Why?</h2>
		<ul className={styles.features}>
			<li>
				<b>Develop faster</b>: with a dev server that starts up in less then
				30ms and build thousands of pages in seconds
			</li>
			<li>
				<b>Open</b>: not VC-backed, no upsell, no cloud-platform exclusive
				features
			</li>
			<li>
				<b>Unbloated</b>: only includes features which you actually use
			</li>
			<li>
				<b>Multi-Site</b>: develop for multiple domains at the same time
			</li>
			<li>
				<b>Great UX</b>: file system based routing, react suspense, great
				TypeScript support, CSS-Modules
			</li>
		</ul>
		<br />
		<Link to="/docs">
			<button type="button">get started</button>
		</Link>
	</>
);
