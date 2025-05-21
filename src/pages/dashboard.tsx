import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Button } from '~/components/button';
import { useAuth } from '~/hooks/use-auth';

export default function Page() {
	const navigate = useNavigate();
	const { ready, user, logout, isLoggingOut } = useAuth();

	useEffect(() => {
		if (!ready || user) return;
		navigate('/');
	}, [user, ready]);

	return (
		<div className="flex h-full w-full flex-col">
			<nav className="bg-brand flex w-full items-center justify-between p-2">
				<h2 className="text-brand-foreground ml-2 text-xl font-bold">
					tabzero
				</h2>

				<div>
					<Button
						onClick={() => logout()}
						loading={isLoggingOut}
					>
						Logout
					</Button>
				</div>
			</nav>
			<Outlet />
		</div>
	);
}
