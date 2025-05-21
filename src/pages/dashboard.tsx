import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Navbar } from '~/components/navbar';
import { useAuth } from '~/hooks/use-auth';

export default function Page() {
	const navigate = useNavigate();
	const { ready, user } = useAuth();

	useEffect(() => {
		if (!ready || user) return;
		navigate('/');
	}, [user, ready]);

	return (
		<div className="flex h-full w-full flex-col">
			<Navbar />
			<Outlet />
		</div>
	);
}
