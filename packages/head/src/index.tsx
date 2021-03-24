import { ReactElement, useEffect, useRef, useState } from 'react';

interface HeadTag {
	parentID: string;
	component: ReactElement;
}

let headTags: HeadTag[] = [];
let heads: string[] = [];

const genID = () => Math.random().toString(36).substring(7);
const unique = genID();

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
	return headTags;
};

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
		}

		return () => unregisterTags(id);
	}, [children, id]);

	return null;
};
