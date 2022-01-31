import './setup-dom.js';

import tap from 'tap';

import { renderHook, act } from '@testing-library/react-hooks';
import useLocation from '../src/use-location.js';

void tap.test('returns a pair [value, update]', async t => {
	const { result, unmount } = renderHook(() => useLocation());
	const [value, update] = result.current;

	t.equal(typeof value, 'string');
	t.equal(typeof update, 'function');
	unmount();
});

void tap.test('`value` first argument', async t => {
	t.beforeEach(() => {
		history.replaceState(null, '', '/');
	});

	void t.test('reflects the current pathname', async t => {
		const { result, unmount } = renderHook(() => useLocation());
		t.equal(result.current[0], '/');
		unmount();
	});

	void t.test('reacts to `pushState` / `replaceState`', async t => {
		const { result, unmount } = renderHook(() => useLocation());

		act(() => history.pushState(null, '', '/foo'));
		t.equal(result.current[0], '/foo');

		act(() => history.replaceState(null, '', '/bar'));
		t.equal(result.current[0], '/bar');
		unmount();
	});

	void t.test('supports history.back() navigation', async t => {
		const { result, unmount } = renderHook(() => useLocation());

		act(() => history.pushState(null, '', '/foo'));
		t.equal(result.current[0], '/foo');

		act(() => {
			history.back();
		});

		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});

		t.equal(result.current[0], '/');
		unmount();
	});

	void t.test('returns a pathname without a basepath', async t => {
		const { result, unmount } = renderHook(() => useLocation({ base: '/app' }));

		act(() => history.pushState(null, '', '/app/dashboard'));
		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});
		t.equal(result.current[0], '/dashboard');
		unmount();
	});

	void t.test('returns `/` when URL contains only a basepath', async t => {
		const { result, unmount } = renderHook(() => useLocation({ base: '/app' }));

		act(() => history.pushState(null, '', '/app'));
		t.equal(result.current[0], '/');
		unmount();
	});

	void t.test('basepath should be case-insensitive', async t => {
		const { result, unmount } = renderHook(() =>
			useLocation({ base: '/MyApp' }),
		);

		act(() => history.pushState(null, '', '/myAPP/users/JohnDoe'));

		t.equal(result.current[0], '/users/JohnDoe');
		unmount();
	});

	void t.test(
		'returns an absolute path in case of unmatched base path',
		async t => {
			const { result, unmount } = renderHook(() =>
				useLocation({ base: '/MyApp' }),
			);

			act(() => history.pushState(null, '', '/MyOtherApp/users/JohnDoe'));
			t.equal(result.current[0], '~/MyOtherApp/users/JohnDoe');
			unmount();
		},
	);

	void t.test('supports search url', async t => {
		const { result, unmount } = renderHook(() => useLocation());

		t.equal(result.current[0], '/');
		t.equal(result.all.length, 1);

		act(() => history.pushState(null, '', '/foo'));

		t.equal(result.current[0], '/foo');
		t.equal(result.all.length, 2);

		act(() => history.pushState(null, '', '/foo'));

		t.equal(result.current[0], '/foo');
		t.equal(result.all.length, 2); // no re-render

		act(() => history.pushState(null, '', '/foo?hello=world'));

		t.equal(result.current[0], '/foo');
		t.equal(result.all.length, 3);

		act(() => history.pushState(null, '', '/foo?goodbye=world'));

		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});

		t.equal(result.current[0], '/foo');
		t.equal(result.all.length, 4);

		unmount();
	});
});

void tap.test('`update` second parameter', async t => {
	void t.test('rerenders the component', async t => {
		const { result, unmount } = renderHook(() => useLocation());
		const update = result.current[1];

		act(() => update('/about'));
		t.equal(result.current[0], '/about');
		unmount();
	});

	void t.test('changes the current location', async t => {
		const { result, unmount } = renderHook(() => useLocation());
		const update = result.current[1];

		act(() => update('/about'));
		t.equal(location.pathname, '/about');
		unmount();
	});

	void t.test('saves a new entry in the History object', async t => {
		const { result, unmount } = renderHook(() => useLocation());
		const update = result.current[1];

		const histBefore = history.length;
		act(() => update('/about'));

		t.equal(history.length, histBefore + 1);
		unmount();
	});

	void t.test(
		'replaces last entry with a new entry in the History object',
		async t => {
			const { result, unmount } = renderHook(() => useLocation());
			const update = result.current[1];

			const histBefore = history.length;
			act(() => update('/foo', { replace: true }));

			t.equal(history.length, histBefore);
			t.equal(location.pathname, '/foo');

			unmount();
		},
	);

	void t.test(
		'stays the same reference between re-renders (function ref)',
		async t => {
			const { result, rerender, unmount } = renderHook(() => useLocation());

			const updateWas = result.current[1];
			rerender();
			const updateNow = result.current[1];

			t.equal(updateWas, updateNow);
			unmount();
		},
	);

	void t.test('supports a basepath', async t => {
		const { result, unmount } = renderHook(() => useLocation({ base: '/app' }));
		const update = result.current[1];

		act(() => update('/dashboard'));
		t.equal(location.pathname, '/app/dashboard');
		unmount();
	});
});
