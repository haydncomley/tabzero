import classNames from 'classnames';
import {
	Copy,
	Download,
	ExternalLink,
	LogOut,
	Moon,
	AudioLines,
	Save,
	Sun,
	TicketPlus,
	TicketX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '~/components/button';
import { DotMatrix } from '~/components/dot-matrix';
import { Referral } from '~/components/referral';
import { Title } from '~/components/title';
import { useAudioPlayer } from '~/hooks/use-audio-player';
import { useAuth } from '~/hooks/use-auth';
import { useSetting } from '~/hooks/use-setting';
import { useStreamDeck } from '~/hooks/use-stream-deck';

const TEST_PHRASE = [
	'Hello there, tabzero reporting for duty and ready to assist you.',
	'Lets get this stream started and pump those viewing numbers up.',
	'Howdy partner, this is your rootin tootin assistant here to help.',
];

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
		updateVoice,
		isUpdatingVoice,
		updateBitsTTS,
		isUpdatingBitsTTS,
	} = useAuth();
	const { isStreamDeckConnected } = useStreamDeck();
	const { speak, isLoadingSpeech } = useAudioPlayer();
	const [darkMode, setDarkMode] = useSetting('darkMode');
	const [referralImageLink, setReferralImageLink] = useState<string>();
	const [testPhraseIndex, setTestPhraseIndex] = useState(0);

	const [voiceGender, setVoiceGender] = useState<'male' | 'female' | undefined>(
		details?.preferences?.voiceGender,
	);
	const [voiceTone, setVoiceTone] = useState<string | undefined>(
		details?.preferences?.voiceTone,
	);
	const [bitsTTS, setBitsTTS] = useState<string | undefined>(
		details?.preferences?.bitsTTS,
	);

	useEffect(() => {
		setVoiceGender(details?.preferences?.voiceGender);
		setVoiceTone(details?.preferences?.voiceTone);
	}, [details?.preferences?.voiceGender, details?.preferences?.voiceTone]);

	useEffect(() => {
		setBitsTTS(details?.preferences?.bitsTTS);
	}, [details?.preferences?.bitsTTS]);

	const hasVoiceChanges =
		details?.preferences?.voiceGender !== voiceGender ||
		details?.preferences?.voiceTone !== voiceTone;
	const hasBitsTTSChanges = details?.preferences?.bitsTTS !== bitsTTS;

	return (
		<main className="relative flex !flex-row">
			<Title title="tabzero - Settings" />
			<div className="relative h-full w-[12rem] border-r">
				<DotMatrix ignoreMouse />
				<div className="relative z-1 flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-6">
					<img
						src={details?.profile_image}
						alt={details?.display_name}
						className="border-outline h-24 w-24 rounded-full border-2"
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
								'rounded-sm px-1.5 py-0.5 text-xs tracking-wide uppercase',
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
				<div className="flex h-full w-full basis-1 flex-col overflow-y-auto px-4 [&>*:not(:last-child)]:border-b">
					{/* Stream Deck */}
					<div className="flex flex-col gap-1 py-4">
						<div className="flex flex-col">
							<label className="text-md font-bold">Stream Deck</label>
							<p className="text-foreground/75 text-sm">
								Get the{' '}
								<Link
									to="https://marketplace.elgato.com/search?q=tabzero"
									target="_blank"
									className="text-brand inline-flex items-center gap-0.5 hover:underline"
									onClick={(e) => {
										e.preventDefault();
										window.ipcRenderer.openExternal(
											'https://marketplace.elgato.com/search?q=tabzero',
										);
									}}
								>
									Stream Deck
									<ExternalLink className="h-3 w-3"></ExternalLink>
								</Link>{' '}
								plugin to trigger tabzero remotely.
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

					{/* Theme */}
					<div className="flex flex-col gap-2 py-4">
						<div className="flex flex-col">
							<label className="text-md font-bold">Theme</label>
							<p className="text-foreground/75 text-sm">
								Change the theme of the app to match your system.
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

					{/* AI Voice */}
					<div className="flex flex-col gap-2 py-4">
						<div className="flex flex-col">
							<label className="text-md font-bold">AI Voice Settings</label>
							<p className="text-foreground/75 text-sm">
								Save your changes in order to test how the AI will sound.
							</p>
						</div>
						<div className="flex gap-2">
							<div className="flex flex-col gap-2">
								<Button
									variant={voiceGender !== 'female' ? 'primary' : 'secondary'}
									onClick={() => setVoiceGender('male')}
								>
									Masculine
								</Button>
								<Button
									variant={voiceGender === 'female' ? 'primary' : 'secondary'}
									onClick={() => setVoiceGender('female')}
								>
									Feminine
								</Button>
							</div>
							<div className="flex w-full flex-col gap-2">
								<textarea
									placeholder={
										'Voice: Very cringe, sarcastic, high-pitched and excited - stutter sometimes and be out of breath between words.\nTone: Excited and exaggerated, very sarcastic.\nDialect: American/British - somewhere in-between.'
									}
									className="border-outline placeholder:text-foreground/75 dark:placeholder:text-background/50 h-full min-h-full w-full resize-y rounded-md border p-2 text-sm"
									value={voiceTone}
									onChange={(e) => setVoiceTone(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Button
									variant="secondary"
									disabled={hasVoiceChanges || isLoadingSpeech}
									loading={isLoadingSpeech}
									onClick={() => {
										if (hasVoiceChanges) return;
										const phrase = TEST_PHRASE[testPhraseIndex];
										setTestPhraseIndex(
											(prev) => (prev + 1) % TEST_PHRASE.length,
										);
										speak({
											text: phrase,
											flush: true,
										});
									}}
								>
									<AudioLines className="h-4 w-4"></AudioLines>
									Test
								</Button>
								<Button
									variant="primary"
									loading={isUpdatingVoice}
									disabled={!hasVoiceChanges || isUpdatingVoice}
									onClick={() => {
										updateVoice({
											tone: voiceTone,
											gender: voiceGender,
										});
									}}
								>
									<Save className="h-4 w-4"></Save>
									Save
								</Button>
							</div>
						</div>
					</div>

					{/* User Bits Callout */}
					<div className="flex flex-col gap-2 py-4">
						<div className="flex flex-col">
							<label className="text-md font-bold">Cheer text-to-speech</label>
							<p className="text-foreground/75 text-sm">
								Users can prompt the AI to say text-to-speech messages using
								their channel points.
							</p>
						</div>
						<div className="flex gap-2">
							<div className="flex w-full flex-col gap-2">
								<input
									type="text"
									placeholder={
										'Reward names (comma separated). E.g. "AI Text-to-speech", or "Highlight My Message,TTS,AI Speech"'
									}
									className="border-outline placeholder:text-foreground/75 dark:placeholder:text-background/50 h-full min-h-full w-full resize-y rounded-md border p-2 text-sm"
									value={bitsTTS}
									onChange={(e) => setBitsTTS(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Button
									variant="primary"
									loading={isUpdatingBitsTTS}
									disabled={!hasBitsTTSChanges || isUpdatingBitsTTS}
									onClick={() => {
										updateBitsTTS({
											bitsTTS,
										});
									}}
								>
									<Save className="h-4 w-4"></Save>
									Save
								</Button>
							</div>
						</div>
					</div>

					{/* Refer a friend */}
					<div className="flex flex-col gap-2 py-4">
						<div className="flex flex-col">
							<label className="text-md font-bold">Refer a friend</label>
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
