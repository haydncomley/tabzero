import classNames from 'classnames';
import { Home, Loader2, Moon, Settings, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { useMeta } from '~/hooks/use-meta';
import { useSetting } from '~/hooks/use-setting';
import { useTwitch } from '~/hooks/use-twitch';

import { version } from '../../../package.json';
import { Button } from '../button';
import { Logo } from '../logo';

export const Navbar = () => {
	const [darkMode, setDarkMode] = useSetting('darkMode');
	const { isLive, viewerCount } = useTwitch();
	const { version: apiVersion } = useMeta();
	const isSettings = useLocation().pathname.includes('/settings');

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
				<Link to={isSettings ? '/dashboard/home' : '/dashboard/settings'}>
					<Button
						variant="primary"
						size="regular"
					>
						{isSettings ? (
							<Home className="h-4 w-4"></Home>
						) : (
							<Settings className="h-4 w-4"></Settings>
						)}
					</Button>
				</Link>
			</div>
		</nav>
	);
};
