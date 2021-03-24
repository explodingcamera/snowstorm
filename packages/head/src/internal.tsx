import React from 'react';
import { renderToString } from 'react-dom/server';
import { getHeadTags } from '.';

export const getHead = () =>
	renderToString(
		<>
			{getHeadTags().map(t => (
				<React.Fragment key={t.parentID}>{t.component}</React.Fragment>
			))}
		</>,
	);
