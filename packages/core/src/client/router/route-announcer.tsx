// This is based on the work of gatsby and next.js
// https://github.com/vercel/next.js/blob/29402f3c68b641f2a40622b16e7954dff5195625/packages/next/client/route-announcer.tsx
// The MIT License (MIT)

// Copyright (c) 2021 Vercel, Inc.
// Copyright (c) 2021 Henry Gressmannn.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from './../../';

export const RouteAnnouncer = () => {
	const [location] = useLocation();
	const [routeAnnouncement, setRouteAnnouncement] = useState('');

	// Only announce the path change, but not for the first load because screen reader will do that automatically.
	const initialPathLoaded = useRef(false);

	// Every time the path changes, announce the route change. The announcement will be prioritized by h1, then title
	// (from metadata), and finally if those don't exist, then the pathName that is in the URL. This methodology is
	// inspired by Marcy Sutton's accessible client routing user testing. More information can be found here:
	// https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
	useEffect(() => {
		if (!initialPathLoaded.current) {
			initialPathLoaded.current = true;
			return;
		}

		let newRouteAnnouncement;
		const pageHeader = document.querySelector('h1');

		if (pageHeader) {
			newRouteAnnouncement = pageHeader.innerText || pageHeader.textContent;
		}

		if (!newRouteAnnouncement) {
			if (document.title) {
				newRouteAnnouncement = document.title;
			} else {
				newRouteAnnouncement = location;
			}
		}

		setRouteAnnouncement(newRouteAnnouncement);
	}, [location]);

	return (
		<p
			aria-live="assertive" // Make the announcement immediately.
			id="__snowstorm-route-announcer__"
			role="alert"
			style={{
				border: 0,
				clip: 'rect(0 0 0 0)',
				height: '1px',
				margin: '-1px',
				overflow: 'hidden',
				padding: 0,
				position: 'absolute',
				width: '1px',

				// https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
				whiteSpace: 'nowrap',
				wordWrap: 'normal',
			}}
		>
			{routeAnnouncement}
		</p>
	);
};
