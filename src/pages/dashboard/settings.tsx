import classNames from 'classnames';
import {
	Copy,
	Download,
	ExternalLink,
	LogOut,
	Moon,
	Sun,
	TicketPlus,
	TicketX,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '~/components/button';
import { DotMatrix } from '~/components/dot-matrix';
import { Referral } from '~/components/referral';
import { useAuth } from '~/hooks/use-auth';
import { useSetting } from '~/hooks/use-setting';
import { useStreamDeck } from '~/hooks/use-stream-deck';

export default function Page() {
	const {
		details,
		subscribe,
		isSubscribing,
		cancel,
		isCancelling,
		resume,
		isResuming,
		logout,
		isLoggingOut,
	} = useAuth();
	const { isStreamDeckConnected } = useStreamDeck();
	const [darkMode, setDarkMode] = useSetting('darkMode');
	const [referralImageLink, setReferralImageLink] = useState<string>();

	return (
		<main className="relative flex !flex-row">
			<div className="relative h-full w-[12rem] border-r">
				<DotMatrix ignoreMouse />
				<div className="relative z-1 flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-6">
					<img
						src={details?.profile_image}
						alt={details?.display_name}
						className="h-24 w-24 rounded-full"
					/>
					<div className="flex flex-col items-center gap-1">
						<h1
							className="w-full truncate text-2xl font-bold"
							title={details?.display_name}
						>
							{details?.display_name}
						</h1>
						<p
							className={classNames(
								'rounded-sm px-1.5 py-0.5 text-xs uppercase',
								{
									'bg-brand text-brand-foreground': details?.isSubscribed,
									'bg-outline text-foreground': !details?.isSubscribed,
								},
							)}
						>
							{details?.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
						</p>
					</div>

					<div className="mt-auto flex flex-col gap-2">
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
								onClick={() =>
									details?.isCancelling
										? resume()
										: subscribe({ length: 'monthly' })
								}
								loading={details?.isCancelling ? isResuming : isSubscribing}
							>
								<TicketPlus className="h-4 w-4"></TicketPlus>
								{details?.isCancelling ? 'Resubscribe' : 'Subscribe'}
							</Button>
						)}
						<Button
							variant="tertiary"
							onClick={() => logout()}
							loading={isLoggingOut}
						>
							<LogOut className="h-4 w-4"></LogOut>
							Logout
						</Button>
					</div>
				</div>
			</div>

			<div className="h-full w-full">
				<div className="flex h-full w-full basis-1 flex-col overflow-y-auto px-4">
					<div className="flex flex-col gap-1 border-b py-4">
						<div className="flex flex-col">
							<label className="text-sm font-bold">Stream Deck</label>
							<p className="text-foreground/75 text-sm">
								Get the{' '}
								<Link
									to="https://www.elgato.com/en/gaming/stream-deck"
									target="_blank"
									className="text-brand inline-flex items-center gap-1 hover:underline"
									onClick={(e) => {
										e.preventDefault();
										window.ipcRenderer.openExternal(
											'https://www.elgato.com/en/gaming/stream-deck',
										);
									}}
								>
									Stream Deck plugin
									<ExternalLink className="h-3 w-3"></ExternalLink>
								</Link>{' '}
								to trigger tabzero remotely.
							</p>
						</div>
						<p className="flex items-center gap-2 font-bold">
							<span
								className={classNames('inline-block h-2 w-2 rounded-full', {
									'bg-brand border-brand-glint border': isStreamDeckConnected,
									'bg-outline': !isStreamDeckConnected,
								})}
							/>
							{isStreamDeckConnected ? 'Connected' : 'Disconnected'}
						</p>
					</div>

					<div className="flex flex-col gap-2 border-b py-4">
						<div className="flex flex-col">
							<label className="text-sm font-bold">Theme</label>
							<p className="text-foreground/75 text-sm">
								Change the theme of the app to your liking
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								variant={!darkMode ? 'primary' : 'secondary'}
								onClick={() => setDarkMode(false)}
							>
								<Sun className="h-4 w-4"></Sun>
								Light
							</Button>
							<Button
								variant={darkMode ? 'primary' : 'secondary'}
								onClick={() => setDarkMode(true)}
							>
								<Moon className="h-4 w-4"></Moon>
								Dark
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2 border-b py-4">
						<div className="flex flex-col">
							<label className="text-sm font-bold">Refer a friend</label>
							<p className="text-foreground/75 text-sm">
								Share a referral link with your friends and community
							</p>
						</div>
						<div className="flex gap-2">
							<Referral
								className="h-auto w-[320px]"
								onDownloadLink={setReferralImageLink}
							/>
							<div className="flex flex-col items-start gap-2">
								<Button
									variant="secondary"
									disabled={!referralImageLink}
									onClick={() => {
										if (!referralImageLink) return;

										const a = document.createElement('a');
										a.href = referralImageLink;
										a.download = 'tabzero-referral.png';
										a.click();
									}}
								>
									<Download className="h-4 w-4"></Download>
									Save image
								</Button>
								<Button
									variant="secondary"
									onClick={() => {
										navigator.clipboard.writeText(
											`https://tabzero.gg/?ref=${details?.user_name}`,
										);
									}}
								>
									<Copy className="h-4 w-4"></Copy>
									Copy link
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
