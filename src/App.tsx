import { signInWithCustomToken } from 'firebase/auth';
import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { codeToToken } from './hooks/use-auth';
import { useSetting } from './hooks/use-setting';
import { auth } from './main';

import routes from '~react-pages';

if (import.meta.env.DEV) {
	(window as any).devLogin = (...args: any[]) => {
		const url = new URL(args[0]);
		const code = url.searchParams.get('code');
		const scope = url.searchParams.get('scope');

		if (!code || !scope) return;

		codeToToken(code).then((token) => {
			signInWithCustomToken(auth, token);
		});
	};
}

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
