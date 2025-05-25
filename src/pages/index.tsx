import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/button';
import { Logo } from '~/components/logo';
import { useAuth } from '~/hooks/use-auth';

export default function Page() {
	const navigate = useNavigate();
	const { ready, user, login, isLoggingIn } = useAuth();

	useEffect(() => {
		if (!ready || !user) return;
		navigate('/dashboard/home');
	}, [user, ready]);

	return (
		<main className="from-brand to-brand-glint flex h-full w-full flex-col items-center justify-center gap-5 bg-gradient-to-tr">
			<Logo className="fixed bottom-0 left-0 aspect-square h-[65vh] w-[65vh]" />

			<div className="flex flex-col">
				<h1 className="relative text-4xl font-bold">
					tabzero
					<span className="absolute top-0 text-xs font-normal">BETA</span>
				</h1>
				<p>AI Stream Assistant - Never tab out again.</p>

				<div className="mt-3 flex gap-4">
					<Button
						onClick={() => login()}
						loading={!ready || isLoggingIn}
						variant="secondary"
					>
						<LogIn></LogIn>
						Login with Twitch
					</Button>
				</div>
			</div>
		</main>
	);
}
