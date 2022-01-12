import React, { FC } from 'react';

import '@snowstorm/core/base.css';
import './global.scss';

import styles from './index.module.scss';
import { Link } from '@snowstorm/core';

import Logo from './../../assets/logo.svg';
import { PageMeta } from '../../types';

const Nav = () => (
	<nav className={styles.nav}>
		<ul>
			<li className={styles.logo}>
				<Link to="/">
					<img src={Logo} height="40" width="40" />
					Snowstorm
				</Link>
			</li>
			<li>
				<Link to="/docs">docs</Link>
			</li>
			<li>
				<a href="https://github.com/explodingcamera/snowstorm">github</a>
			</li>
		</ul>
	</nav>
);

const Sidebar = () => (
	<aside className={styles.sidebar}>
		<h1>Documentation</h1>
		<ul>
			<li>hi</li>
		</ul>
	</aside>
);

export const Layout: FC<{ className?: string; meta: PageMeta }> = ({
	children,
	className,
	meta,
}) => (
	<div
		className={`${className || ''} ${meta?.layoutClassName || ''} ${
			styles.wrapper
		}`.trim()}
	>
		<Nav />
		<main className={styles.main}>
			{!meta?.disableSidebar && <Sidebar />}
			<div className={meta?.wrapperClassName}>{children}</div>
		</main>
	</div>
);
