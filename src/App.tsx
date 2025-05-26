import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { useSetting } from './hooks/use-setting';

import routes from '~react-pages';

// testing

export default function App() {
	const [darkMode] = useSetting('darkMode');

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [darkMode]);

	return <Suspense fallback={null}>{useRoutes(routes)}</Suspense>;
}
