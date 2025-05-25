import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import routes from '~react-pages';

// testing

export default function App() {
	return <Suspense fallback={null}>{useRoutes(routes)}</Suspense>;
}
