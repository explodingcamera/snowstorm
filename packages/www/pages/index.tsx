import { PageMeta } from '../types';

import styles from './index.module.scss';

export const meta: PageMeta = {
	disableSidebar: true,
	wrapperClassName: styles.wrapper,
};

export const Index = () => (
	<>
		<h1>The lightning-fast and minimalist React Framework</h1>
		<h2>What?</h2>
		<p>
			Snowstorm is a "framework" for react, which handles the heavy lifting
			involved with shipping a react project so you can focus on creating
			awesome things!
		</p>
		<h2>Why?</h2>
		<ul>
			<li>
				Develop faster, with a dev server that starts up in less then 100ms
			</li>
			<li>Unbloated: only includes features which you actually use</li>
			<li>Builds thousands of pages in seconds</li>
			<li>
				Versitile: supports everything from complex server side code to blazing
				fast, javascript free static websites
			</li>
			<li>File system based routing (which can also be disabled)</li>
			<li>
				Multi-Site support: routes can not only based on the path but also your
				domain
			</li>
			<li>
				First-class static exports: no features gated behind proprietary
				"serverless solutions
			</li>
		</ul>
	</>
);
