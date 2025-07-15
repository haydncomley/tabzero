import classNames from 'classnames';
import { Loader2, LogOut, Moon, Sun, TicketPlus, TicketX } from 'lucide-react';

import { useAuth } from '~/hooks/use-auth';
import { useMeta } from '~/hooks/use-meta';
import { useSetting } from '~/hooks/use-setting';
import { useTwitch } from '~/hooks/use-twitch';

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
	const { isLive, viewerCount } = useTwitch();
	const { version: apiVersion } = useMeta();

	return (
		<nav className="flex w-full items-center justify-between border-b p-3">
			<div className="flex items-center gap-2">
				<Logo className="h-10 w-10"></Logo>
				<div className="ml-2 flex flex-col">
					<h1 className="text-xl font-bold">tabzero</h1>
					<p className="text-foreground/50 flex items-center gap-2 text-xs">
						Client v{version}
						{apiVersion ? (
							` - API v${apiVersion}`
						) : (
							<Loader2 className="h-3 w-3 animate-spin"></Loader2>
						)}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2">
					<p className="text-sm tracking-widest">
						{isLive ? 'LIVE' : 'OFFLINE'}
					</p>
					<div
						className={classNames('h-2 w-2 rounded-full', {
							'bg-brand animate-pulse': isLive,
							'bg-foreground/50': !isLive,
						})}
					></div>
					{isLive && <p className="text-sm">{viewerCount}</p>}
				</div>

				<Button
					onClick={() => setDarkMode(!darkMode)}
					variant="secondary"
					size="small"
				>
					{!darkMode ? (
						<Sun className="h-4 w-4"></Sun>
					) : (
						<Moon className="h-4 w-4"></Moon>
					)}
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
