import { useEffect } from 'react';

export const Title = ({ title }: { title: string }) => {
	useEffect(() => {
		document.title = title;
	}, [title]);

	return null;
};
