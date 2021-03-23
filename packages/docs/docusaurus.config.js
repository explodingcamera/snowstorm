module.exports = {
	title: 'Snowstorm',
	tagline: 'The lightning-fast and minimalist React Framework',
	favicon: './../core/assets/public/favicon.ico',
	organizationName: 'explodingcamera',
	projectName: 'snowstorm',
	url: 'https://snowstorm.js.org',
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.json'),
					editUrl:
						'https://github.com/explodingcamera/snowstorm/edit/main/packages/docs',
					path: '../../docs',
					showLastUpdateAuthor: true,
					showLastUpdateTime: true,
				},
			},
		],
	],
	themeConfig: {
		navbar: {
			title: 'Snowstorm',
			logo: {
				alt: 'Snowstorm Logo',
				src: 'img/logo.svg',
			},
			items: [
				{ to: 'docs/getting-started', label: 'Docs', position: 'left' },
				{
					href: 'https://www.github.com/explodingcamera/snowstorm',
					label: 'GitHub',
					position: 'left',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Get Started',
							to: 'docs/getting-started',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'GitHub Discussions',
							href: 'https://github.com/explodingcamera/snowstorm/discussions',
						},
						{
							label: 'Roadmap',
							href: 'https://github.com/explodingcamera/snowstorm/projects/1',
						},
					],
				},
				{
					title: 'Social',
					items: [
						{
							label: 'GitHub',
							href: 'https://www.github.com/explodingcamera/snowstorm',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Henry Gressmann`,
		},
	},
};
