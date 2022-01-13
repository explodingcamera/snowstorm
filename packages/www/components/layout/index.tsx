import React, { FC } from 'react';

import '@snowstorm/core/base.css';
import './global.scss';
import './dracula.css';

import styles from './index.module.scss';
import { Link } from '@snowstorm/core';

import Logo from './../../assets/logo.svg';
import { PageMeta } from '../../types';

type Sidebar = Array<Section | Page>;

interface Section {
	title: string;
	pages: Array<Page | Section>;
}

interface Page {
	title: string;
	slug?: string;
}

const sidebar: Sidebar = [
	{
		title: 'documentation',
		pages: [
			{ title: 'getting started', slug: '' },
			{
				title: 'basic features',
				pages: [
					{
						title: 'pages',
					},
					{
						title: 'routing',
					},
					{
						title: 'css',
					},
					{
						title: 'static assets',
						slug: '/static',
					},
					{
						title: 'importing libraries',
						slug: '/imports',
					},
				],
			},
			{
				title: 'advanced features',
				pages: [
					{
						title: 'webassembly',
						slug: '/wasm',
					},
					{
						title: 'workers',
					},
					{
						title: 'environment variables',
					},
					{
						title: 'custom `App`',
						slug: '/custom-app',
					},
				],
			},
			{ title: 'plugins' },
			{
				title: 'deploying a site',
				slug: '/deploy',
			},
			{
				title: 'browser support',
				slug: '/browser-support',
			},
		],
	},
	{
		title: 'api reference',
		pages: [
			{ title: 'configuration', slug: '/api/config' },
			{ title: 'CLI', slug: '/api/cli' },
			{ title: 'Plugin API', slug: '/api/plugins' },
		],
	},
	{
		title: 'inspirations',
		slug: '/inspirations',
	},
];

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

const isSection = (x: Section | Page): x is Section => (x as any).pages;

const SidebarComponent = () => (
	<aside className={styles.sidebar}>
		<ul>
			{sidebar.map(a =>
				isSection(a) ? (
					<li key={a.title}>
						<h1># {a.title}</h1>
						<ul>
							{a.pages.map(b =>
								isSection(b) ? (
									<li>
										<h2 key={b.title}>
											+ <span>{b.title}</span>
										</h2>
									</li>
								) : (
									<li>
										<h2 key={b.title}>
											{'> '}
											<span>{b.title}</span>
										</h2>
									</li>
								),
							)}
						</ul>
					</li>
				) : (
					<li key={a.title}>
						<h2>
							<span>{a.title}</span>
						</h2>
					</li>
				),
			)}
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
			{!meta?.disableSidebar && <SidebarComponent />}
			<div className={meta?.wrapperClassName}>{children}</div>
		</main>
	</div>
);
