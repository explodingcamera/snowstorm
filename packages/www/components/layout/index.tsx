import type { FC } from 'react';
import { useState } from 'react';

import '@snowstorm/core/base.css';
import './global.scss';
import './dracula.css';

import styles from './index.module.scss';
import { Link, useLocation } from '@snowstorm/core';

import Logo from './../../assets/logo.svg';
import type { PageMeta } from '../../types';

type SidebarItem = Section | Page;
type Sidebar = SidebarItem[];

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
						slug: 'static-assets',
					},
					{
						title: 'sites',
					},
					{
						title: 'custom fonts',
						slug: 'custom-fonts',
					},
					{
						title: 'importing libraries',
						slug: 'imports',
					},
				],
			},
			{
				title: 'advanced features',
				pages: [
					{
						title: 'webassembly',
						slug: 'wasm',
					},
					{
						title: 'dynamic routes',
						slug: 'dynamic-routes',
					},
					{
						title: 'workers',
					},
					{
						title: 'environment variables',
						slug: 'env-variables',
					},
					{
						title: 'custom `App`',
						slug: 'custom-app',
					},
				],
			},
			{ title: 'plugins' },
			{
				title: 'deploying a site',
				slug: 'deploy',
			},
			{
				title: 'browser support',
				slug: 'browser-support',
			},
		],
	},
	{
		title: 'api reference',
		pages: [
			{ title: 'configuration', slug: 'api/config' },
			{ title: 'cli', slug: 'api/cli' },
			{ title: 'plugin api', slug: 'api/plugins' },
		],
	},
	{
		title: 'inspirations',
		slug: 'inspirations',
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
				<a
					target="_blank"
					referrerPolicy="no-referrer"
					href="https://github.com/explodingcamera/snowstorm"
					rel="noreferrer"
				>
					github
				</a>
			</li>
		</ul>
	</nav>
);

const isSection = (x: Section | Page): x is Section => (x as any).pages;

const Item = ({ level = 0, item }: { level?: number; item: SidebarItem }) => {
	const [expanded, setExpanded] = useState(true);
	const [location] = useLocation();
	const toggle = () => setExpanded(x => !x);

	let component: React.ReactElement;
	if (isSection(item)) {
		component = (
			<>
				{level === 0 ? (
					<h1># {item.title}</h1>
				) : (
					<h2 onClick={toggle}>
						{expanded ? '-' : '+'} <span>{item.title}</span>
					</h2>
				)}
				<ul
					className={
						(level !== 0 && !expanded && styles.retracted) || undefined
					}
				>
					{item.pages.map(i => (
						<Item key={i.title} level={level + 1} item={i} />
					))}
				</ul>
			</>
		);
	} else {
		component = (
			<h2
				className={
					(location.endsWith(item.slug || item.title) && styles.active) ||
					undefined
				}
			>
				{level <= 1 ? '> ' : <>&nbsp;&gt;&nbsp;</>}
				<span>{item.title}</span>
			</h2>
		);
		component = (
			<Link to={'/docs/' + (item.slug ?? item.title)}>{component}</Link>
		);
	}

	return <li key={item.title}>{component}</li>;
};

const SidebarComponent = () => (
	<aside className={styles.sidebar}>
		<ul>
			{sidebar.map(item => (
				<Item key={item.title} item={item} />
			))}
		</ul>
	</aside>
);

export const Layout: FC<{
	className?: string;
	meta: PageMeta;
	children: React.ReactNode;
}> = ({ children, className, meta }) => (
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
