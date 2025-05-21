import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/button';
import { useAuth } from '~/hooks/use-auth';

export default function Page() {
	const navigate = useNavigate();
	const { ready, user, login } = useAuth();

	useEffect(() => {
		if (!ready || !user) return;
		navigate('/dashboard/home');
	}, [user, ready]);

	return (
		<main className="flex h-full w-full flex-col items-center justify-center gap-5">
			<div className="flex flex-col items-center justify-center">
				<h1 className="bg-background text-3xl font-bold">tabzero</h1>
				<p className="text-center">
					AI Stream Assistant - Never tab out again.
				</p>
			</div>

			<div className="flex items-center justify-center gap-4">
				<Button
					onClick={() => login()}
					loading={!ready}
					variant="twitch"
				>
					Log in with Twitch
				</Button>
			</div>
		</main>
	);
}
