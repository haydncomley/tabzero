import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/button';
import { DotMatrix } from '~/components/dot-matrix';
import { Logo } from '~/components/logo';
import { Title } from '~/components/title';
import { useAuth } from '~/hooks/use-auth';

export default function Page() {
	const navigate = useNavigate();
	const { ready, user, login, isLoggingIn } = useAuth();
	const isDevMode = import.meta.env.DEV;

	useEffect(() => {
		if (!ready || !user) return;
		navigate('/dashboard/home');
	}, [user, ready]);

	return (
		<main className="bg-background flex h-full w-full flex-col items-center justify-center gap-5">
			<DotMatrix ignoreMouse />
			<Title title="tabzero - Login" />
			<Logo
				className="fixed bottom-0 left-0 z-10 aspect-square h-[50vh] w-[50vh]"
				variant="brand"
			/>

			<div className="text-brand-foreground z-10 flex flex-col">
				<div className="flex flex-col">
					<h1 className="relative text-4xl font-bold">tabzero</h1>
					<p>AI Stream Assistant - Never tab out again.</p>
				</div>

				<div className="mt-3 flex flex-col items-start gap-4">
					<Button
						onClick={() => login()}
						loading={!ready || isLoggingIn}
						variant="primary"
					>
						<LogIn className="h-4 w-4"></LogIn>
						Login with Twitch
					</Button>

					{isDevMode && isLoggingIn ? (
						<input
							type="text"
							className="border-outline bg-background w-full rounded-md border px-3 py-2 text-sm"
							placeholder="Paste login link here"
							onChange={(e) => {
								(window as any).devLogin(e.target.value);
							}}
						/>
					) : null}
				</div>
			</div>
		</main>
	);
}
