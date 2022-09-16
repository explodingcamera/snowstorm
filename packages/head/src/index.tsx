import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

interface HeadTag {
	parentID: string;
	component: ReactElement;
}

let headTags: HeadTag[] = [];
let heads: string[] = [];

const genID = () => Math.random().toString(36).substring(7);
const registerTags = (id: string, tags: ReactElement[]) => {
	heads.push(id);
	headTags.push(
		...tags.map(child => ({
			parentID: id,
			component: child,
		})),
	);
};

const unregisterTags = (id: string) => {
	headTags = headTags.filter(tag => tag.parentID !== id);
	heads = heads.filter(head => head !== id);
};

export const getHeadTags = () => {
	const headNoTitle = headTags.filter(tag => tag.component.type !== 'title');
	const titleTags = headTags.filter(tag => tag.component.type === 'title');
	const headTag = titleTags.slice(-1);

	return [...headTag, ...headNoTitle];
};

const handleTitle = (title: ReactElement<HTMLTitleElement>) => {
	const titleText = title.props.children;
	if (typeof titleText !== 'string')
		throw new Error('title has to be of type string');
	document.title = titleText;
};

/**
 * @example
 * ```
 * <Head>
 * 	<title>Hello World!</title>
 * </Head>
 * ```
 */
export const Head = ({ children }: { children: ReactElement[] }) => {
	const isInitialMount = useRef(true);
	const [id] = useState(() => {
		const id = genID();
		registerTags(id, children);
		return id;
	});

	useEffect(() => {
		// add head tags
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			unregisterTags(id);
			registerTags(id, children);

			const title = children.find(c => c.type === 'title');
			if (title) handleTitle(title);
		}

		return () => unregisterTags(id);
	}, [children, id]);

	return null;
};
