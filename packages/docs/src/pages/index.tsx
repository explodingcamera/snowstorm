/**
 * Copyright (c) 2021 Henry Gressmann
 * Copyright (c) 2017-2021, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Layout from '@theme/Layout';
// import CodeBlock from '@theme/CodeBlock';

import clsx from 'clsx';

import styles from './styles.module.css';

const features = [
	{
		title: 'Fast',
		content:
			'like - really fast. Develop faster, with a dev server that starts up in less then 200ms, even in large projects. Thanks to Snowpack, no file is ever build twice.',
	},
	{
		title: 'Zero-Config',
		content:
			"Out-of-the-box support for nearly everything you will ever need. Typescript, MDX, you name it.\nIn addition, there's an extensive plugin ecosystem enabling you to use even the most niche tools.",
	},
	{
		title: 'Great Developer Experience',
		content:
			'Spend your time building products, not fighting tools. Be it static site generation, server side rendering or Hot Reloading - everything already works.',
	},
];

const Home = () => {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;

	return (
		<Layout
			permalink="/"
			description="Set up a modern web app by running one command."
		>
			<div className={clsx('hero hero--dark', styles.heroBanner)}>
				<div className="container">
					<img
						className={clsx(styles.heroBannerLogo, 'margin-vert--md')}
						alt="Snowstorm logo"
						src={useBaseUrl('img/logo.svg')}
					/>
					<h1 className="hero__title">{siteConfig.title}</h1>
					<p className="hero__subtitle">{siteConfig.tagline}</p>
					<div className={styles.getStarted}>
						<Link
							className="button button--outline button--primary button--lg"
							to={useBaseUrl('docs/getting-started')}
						>
							Get Started
						</Link>
					</div>
				</div>
			</div>
			{features && features.length && (
				<div className={styles.features}>
					<div className="container">
						<div className="row">
							<div className={clsx('col col--3', styles.feature, styles.why)}>
								<h1>Why Snowstorm?</h1>
							</div>
							{features.map(({ title, content }, idx) => (
								<div key={idx} className={clsx('col col--3', styles.feature)}>
									<h2>{title}</h2>
									<p>{content}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{/* <div className={styles.gettingStartedSection}>
				<div className="container padding-vert--xl text--left">
					<div className="row">
						<div className="col col--4 col--offset-1">
							<h2>Get started in seconds</h2>
							<p>
								Whether you’re using React or another library, Create React App
								lets you <strong>focus on code, not build tools</strong>.
								<br />
								<br />
								To create a project called <i>my-app</i>, run this command:
							</p>
							<CodeBlock className="language-sh">
								npx create-react-app my-app
							</CodeBlock>
							<br />
						</div>
						<div className="col col--5 col--offset-1">
							<img
								className={styles.featureImage}
								alt="Easy to get started in seconds"
								src="https://camo.githubusercontent.com/29765c4a32f03bd01d44edef1cd674225e3c906b/68747470733a2f2f63646e2e7261776769742e636f6d2f66616365626f6f6b2f6372656174652d72656163742d6170702f323762343261632f73637265656e636173742e737667"
							/>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="container padding-vert--xl text--left">
					<div className="row">
						<div className="col col--4 col--offset-1">
							<img
								className={styles.featureImage}
								alt="Easy to update"
								src={useBaseUrl('img/update.png')}
							/>
						</div>
						<div className="col col--5 col--offset-1">
							<h2>Easy to Maintain</h2>
							<p>
								Updating your build tooling is typically a daunting and
								time-consuming task. When new versions of Create React App are
								released, you can upgrade using a single command:
							</p>
							<CodeBlock className="language-sh">
								npm install react-scripts@latest
							</CodeBlock>
						</div>
					</div>
				</div>
			</div> */}
		</Layout>
	);
};

export default Home;
