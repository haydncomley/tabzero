import classNames from 'classnames';
import { LogOut, Moon, Sun, TicketPlus, TicketX } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '~/hooks/use-auth';
import { useMeta } from '~/hooks/use-meta';
import { useSetting } from '~/hooks/use-setting';

import { version } from '../../../package.json';
import { Button } from '../button';
import { Logo } from '../logo';

export const Navbar = () => {
	const [darkMode, setDarkMode] = useSetting('darkMode');
	const {
		details,
		logout,
		subscribe,
		isSubscribing,
		cancel,
		isCancelling,
		resume,
		isResuming,
	} = useAuth();
	const { version: apiVersion } = useMeta();
	const [lastApiVersion, setLastApiVersion] = useSetting('lastApiVersion');
	const [isNewVersion, setIsNewVersion] = useState(false);

	useEffect(() => {
		if (lastApiVersion !== apiVersion && apiVersion) {
			setLastApiVersion(apiVersion);
			setIsNewVersion(true);
		}
	}, [apiVersion]);

	return (
		<nav className="flex w-full items-center justify-between border-b p-3">
			<div className="flex items-center gap-2">
				<Logo className="h-10 w-10"></Logo>
				<div className="ml-2 flex flex-col">
					<h1 className="text-xl font-bold">tabzero</h1>
					<p className="text-foreground/50 text-xs">
						Client v{version} -{' '}
						<span
							className={classNames({
								'text-brand': isNewVersion,
							})}
						>
							API v{apiVersion}
							{isNewVersion ? ' (UPDATED)' : ''}
						</span>
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Button
					onClick={() => setDarkMode(!darkMode)}
					variant="secondary"
				>
					{!darkMode ? (
						<Sun className="h-4 w-4"></Sun>
					) : (
						<Moon className="h-4 w-4"></Moon>
					)}
					{!darkMode ? 'Light Mode' : 'Dark Mode'}
				</Button>

				{details?.isSubscribed && !details.isCancelling ? (
					<Button
						onClick={() => cancel()}
						variant="secondary"
						loading={isCancelling}
					>
						<TicketX className="h-4 w-4"></TicketX>
						Unsubscribe
					</Button>
				) : (
					<Button
						onClick={() => (details?.isCancelling ? resume() : subscribe())}
						loading={details?.isCancelling ? isResuming : isSubscribing}
					>
						<TicketPlus className="h-4 w-4"></TicketPlus>
						{details?.isCancelling ? 'Re-subscribe' : 'Subscribe'}
					</Button>
				)}
				<button className="group flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
					<img
						src={details?.profile_image}
						alt={details?.display_name}
					/>
				</button>
				<Button
					onClick={() => logout()}
					variant="secondary"
				>
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</div>
		</nav>
	);
};
