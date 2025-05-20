/* eslint-disable import/order */
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

// @ts-expect-error - File System Routes
import routes from '~react-pages';

export default function App() {
	return <Suspense fallback={null}>{useRoutes(routes)}</Suspense>;
}
