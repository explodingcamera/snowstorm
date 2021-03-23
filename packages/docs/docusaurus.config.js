module.exports = {
	title: 'Snowstorm',
	tagline: 'The lightning-fast and minimalist React Framework',
	favicon: './../core/assets/public/favicon.ico',
	organizationName: 'explodingcamera',
	projectName: 'snowstorm',
	url: 'https://explodingcamera.github.io',
	baseUrl: '/snowstorm/',
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.json'),
					path: '../../docs',
					showLastUpdateAuthor: true,
					showLastUpdateTime: true,
				},
			},
		],
	],
	themeConfig: {
		image: 'img/logo-og.png',
		navbar: {
			title: 'Snowstorm',
			logo: {
				alt: 'Snowstorm Logo',
				src: 'img/logo.svg',
			},
			items: [
				{ to: 'docs/getting-started', label: 'Docs', position: 'right' },
				{
					href: 'https://reactjs.org/community/support.html',
					label: 'Help',
					position: 'right',
				},
				{
					href: 'https://www.github.com/facebook/create-react-app',
					label: 'GitHub',
					position: 'right',
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
