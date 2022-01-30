import './setup-dom.js';

import tap from 'tap';
import React from 'react';

// switch to @testing-library/react when ready https://github.com/testing-library/react-testing-library/pull/991
import { renderHook } from '@testing-library/react-hooks';

import { Router, useRouter } from '../src/index.js';

void tap.test('creates a router object on demand', async t => {
	const { result } = renderHook(() => useRouter());
	t.ok(result.current instanceof Object);
});

void tap.test('creates a router object only once', async t => {
	const { result, rerender } = renderHook(() => useRouter());
	const router = result.current;

	rerender();
	t.equal(result.current, router);
});

void tap.test('caches the router object if Router rerenders', async t => {
	const { result, rerender } = renderHook(() => useRouter(), {
		wrapper: props => <Router>{props.children}</Router>,
	});
	const router = result.current;

	rerender();
	t.equal(result.current, router);
});

void tap.test(
	'returns customized router provided by the <Router />',
	async t => {
		const newMatcher: any = () => 'n00p';

		const { result } = renderHook(() => useRouter(), {
			wrapper: props => <Router matcher={newMatcher}>{props.children}</Router>,
		});
		const router = result.current;

		t.equal(router.matcher, newMatcher);
		t.ok(router instanceof Object);
	},
);

// TestRenderer is not supported for react 18
// void tap.test('shares one router instance between components', async t => {
// 	const RouterGetter = ({ el }: any) => {
// 		const router = useRouter();
// 		return cloneElement(el, { router });
// 	};

// 	const { root } = TestRenderer.create(
// 		<>
// 			<RouterGetter el={<div />} />
// 			<RouterGetter el={<div />} />
// 			<RouterGetter el={<div />} />
// 			<RouterGetter el={<div />} />
// 		</>,
// 	);

// 	const uniqRouters = [
// 		...new Set(root.findAllByType('div').map(x => x.props.router)),
// 	];

// 	t.equal(uniqRouters.length, 1);
// });
