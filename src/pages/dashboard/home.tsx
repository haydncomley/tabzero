import classNames from 'classnames';
import {
	ExternalLink,
	HelpCircle,
	Loader2,
	Mic,
	SendHorizonal,
	Sparkles,
	X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '~/components/button';
import { EventLog } from '~/components/event-log';
import { useAudioPlayer } from '~/hooks/use-audio-player';
import { SOUND_ON } from '~/hooks/use-audio-player/lib/constants';
import { useAuth } from '~/hooks/use-auth';
import { useDebounce } from '~/hooks/use-debounce';
import { useHotkey } from '~/hooks/use-hotkey';
import { useLog } from '~/hooks/use-log';
import { useMeta } from '~/hooks/use-meta';
import { useSpeechToText } from '~/hooks/use-speech-to-text';
import { useStreamDeck } from '~/hooks/use-stream-deck';
import { useToolResolver } from '~/hooks/use-tool-resolver';
import { useTwitch } from '~/hooks/use-twitch';

import StreamDeckIcon from './stream-deck-icon.jpg';

const INFO_COLOR_MAP = {
	Twitch: 'text-twitch-glint',
	StreamDeck: 'text-stream-deck',
};

export default function Page() {
	const recordButtonRef = useRef<HTMLButtonElement>(null);
	const { play } = useAudioPlayer();
	const { subscribe, isSubscribing, details } = useAuth();
	const { toolList } = useMeta();
	const { isLive, chatMessages } = useTwitch();
	const { log } = useLog();
	const { transcribe, audioUrl, state, toggleRecording } = useSpeechToText();
	const { resolveTools, runTools, isRunningTools, isResolvingTools } =
		useToolResolver();
	const { isStreamDeckConnected } = useStreamDeck();
	const [showInfo, setShowInfo] = useState(false);
	const [prompt, setPrompt] = useState('');

	const isRecordingDebounced = useDebounce(
		state === 'recording',
		state === 'recording' ? 0 : 500,
	);

	useHotkey(
		'toggleRecording',
		() => {
			setPrompt('');
			if (recordButtonRef.current) recordButtonRef.current.click();
		},
		[!!recordButtonRef.current],
	);

	useHotkey('clipStream', () => {
		play(SOUND_ON);
		resolveTools({ transcription: 'Clip the stream.' }).then((action) => {
			if (!action) return;
			runTools({ action });
		});
	});

	const isLoading =
		isResolvingTools ||
		isRecordingDebounced ||
		isRunningTools ||
		state === 'transcribing' ||
		state === 'recording';

	const isLoadingResolver =
		isResolvingTools ||
		state === 'transcribing' ||
		state === 'recording' ||
		isRecordingDebounced;

	const isLoadingTools =
		isResolvingTools || isRunningTools || state === 'transcribing';

	const sendPrompt = useCallback(
		(prompt: string) =>
			new Promise((resolve) => {
				resolveTools({ transcription: prompt }).then((action) => {
					if (!action) return;
					runTools({ action }).finally(() => {
						resolve(true);
					});
				});
			}),
		[],
	);

	useEffect(() => {
		if (!audioUrl) return;
		transcribe().then((transcription) => {
			if (!transcription) return;
			sendPrompt(transcription);
		});
	}, [audioUrl]);

	useEffect(() => {
		window.ipcRenderer.sendToStreamDeck({
			isListening: state === 'recording',
			isLoading: isLoadingResolver,
		});
	}, [isLoadingResolver, state === 'recording']);

	return (
		<main className="relative !overflow-hidden">
			<div className="no-scrollbar flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
				{isLoadingResolver ? (
					<EventLog
						date="Just Now"
						isLoading
						text={state === 'recording' ? 'Listening...' : 'Working...'}
					></EventLog>
				) : null}
				{!log.length && !isLoadingResolver ? (
					<EventLog
						date="Nothing here just yet..."
						isLoading
						text="Try asking a question or typing a prompt down below 🚀"
					></EventLog>
				) : null}
				{log.map((logItem) => (
					<EventLog
						key={logItem.id}
						date={logItem.timestamp.toDate().toLocaleTimeString()}
						text={logItem.text}
						tools={logItem.tools}
					></EventLog>
				))}
			</div>

			{/* Chat Messages */}
			{chatMessages.length && isLive ? (
				<div className="absolute right-0 bottom-14 flex flex-col gap-2 p-4">
					<div className="bg-background no-scrollbar flex max-h-[15rem] w-xs flex-col overflow-auto rounded-xl border">
						{chatMessages.map((message) => (
							<div
								key={message.id}
								className="flex flex-col p-3 px-4 not-last:border-b"
							>
								<p className="text-sm font-bold">{message.user}</p>
								<p className="text-sm">{message.message}</p>
							</div>
						))}
					</div>
				</div>
			) : null}

			{/* Prompt Entry */}
			<div
				className={classNames(
					'absolute right-0 bottom-0 flex items-center gap-2 p-4 transition-all duration-150',
					{
						'pointer-events-none': isLoadingTools,
					},
				)}
			>
				{isStreamDeckConnected ? (
					<img
						src={StreamDeckIcon}
						alt="Stream Deck Connected"
						className="animate-blip h-9 w-9 cursor-pointer rounded-full transition-transform duration-75 hover:scale-90"
						onClick={() => setShowInfo(!showInfo)}
						title="Stream Deck Connected"
					/>
				) : null}

				<Button
					size="small"
					onClick={() => setShowInfo(!showInfo)}
					title="View Capabilities"
					variant="primary"
				>
					<HelpCircle className="h-4 w-4 shrink-0"></HelpCircle>
				</Button>

				<div
					className={classNames(
						'shadow-brand/25 flex items-center gap-3 rounded-xl border px-4 py-2 shadow-md transition-all duration-150',
						{
							'bg-brand text-brand-foreground border-brand-glint': !isLoading,
							'bg-brand-glint text-brand-foreground border-brand': isLoading,
						},
					)}
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 shrink-0 animate-spin"></Loader2>
					) : (
						<Sparkles className="h-4 w-4 shrink-0 animate-pulse"></Sparkles>
					)}
					{!isLoading ? (
						<input
							disabled={isLoading}
							type="text"
							name="prompt"
							id="prompt"
							placeholder="Prompt..."
							value={prompt}
							onChange={(e) => setPrompt(e.currentTarget.value)}
							className={classNames(
								'placeholder:text-brand-foreground/50 appearance-none bg-transparent text-sm font-normal text-inherit transition-all duration-150 outline-none',
								{
									'w-25': isLoading,
									'w-25 focus:w-sm': !isLoading,
								},
							)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									sendPrompt(prompt).finally(() => {
										setPrompt('');
									});
								}
							}}
						/>
					) : (
						<p className="w-full text-sm">
							{state === 'recording' ? 'Listening...' : 'Working...'}
						</p>
					)}

					<button
						ref={recordButtonRef}
						className={classNames(
							'-mr-2 shrink-0 cursor-pointer rounded-full border p-1 transition-all duration-100',
							{
								'bg-brand-glint text-brand-foreground border-brand-glint/50 hover:scale-110':
									state !== 'recording' && !isLoadingTools,
								'scale-0 opacity-0': isLoadingTools,
								'bg-brand text-brand-foreground border-brand-glint hover:scale-125':
									state === 'recording',
							},
						)}
						onClick={() => {
							if (prompt.length) {
								sendPrompt(prompt).finally(() => {
									setPrompt('');
								});
							} else {
								toggleRecording();
							}
						}}
					>
						{prompt.length ? (
							<SendHorizonal className="h-4 w-4"></SendHorizonal>
						) : (
							<Mic className="h-4 w-4 text-inherit"></Mic>
						)}
					</button>
				</div>
			</div>

			{/* Capabilities Sheet  */}
			<div
				className={classNames(
					'bg-background text-foreground border-brand absolute bottom-0 left-4 z-10 w-7/12 overflow-hidden rounded-t-xl border border-b-0 transition-all duration-150',
					{
						'pointer-events-none translate-y-full': !showInfo,
					},
				)}
			>
				<div className="border-b px-3 py-2">
					<div className="flex items-center gap-2 font-bold">
						<Sparkles className="h-4 w-4"></Sparkles>
						Tools Available
						<div className="ml-auto">
							<Button
								disabled={!showInfo}
								size="small"
								onClick={() => setShowInfo(!showInfo)}
								title="Hide Tools"
								variant="secondary"
							>
								<X className="h-4 w-4 shrink-0"></X>
							</Button>
						</div>
					</div>
				</div>

				<div className="flex max-h-[50vh] flex-wrap gap-2 overflow-auto p-3">
					{isStreamDeckConnected ? (
						<div className="flex flex-col items-start rounded-lg border p-2.5 px-3">
							<p className="from-stream-deck to-stream-deck-glint bg-gradient-to-r bg-clip-text text-xs font-bold text-transparent">
								Stream Deck
							</p>
							<p className="text-xs opacity-75">
								Use your Stream Deck to control tabzero.
							</p>
						</div>
					) : null}
					{toolList.map((tool) => {
						const toolVendor = tool.name.split(
							':',
						)[0] as keyof typeof INFO_COLOR_MAP;
						const toolName = tool.name.split(':')[1];

						return (
							<div
								key={tool.name}
								className="flex flex-col items-start rounded-lg border p-2.5 px-3"
							>
								<p className="text-xs">
									<span
										className={classNames(
											'font-bold',
											INFO_COLOR_MAP[toolVendor],
										)}
									>
										{toolVendor}
									</span>
									{` - ${toolName}`}
								</p>
								<p className="text-xs opacity-75">{tool.description}</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* First Subscription Overlay */}
			{!details?.isSubscribed ? (
				<div className="bg-background/50 absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-6 backdrop-blur-xs">
					<h1 className="flex flex-col text-center text-xl">
						<span>
							Welcome to <b className="font-bold">tabzero</b>
						</span>
						<small className="text-sm">
							Your personal AI Stream Assistant.
						</small>
					</h1>

					<div className="flex gap-4">
						<article
							onClick={() => subscribe({ length: 'monthly' })}
							className="bg-background border-brand-glint/50 relative flex w-[10rem] cursor-pointer flex-col overflow-hidden rounded-2xl border p-4 pb-3 shadow-sm transition-transform hover:scale-105"
						>
							<h4 className="flex items-center gap-2">Monthly</h4>
							<p>
								<span className="text-md font-bold">£4.79</span>
								<span className="text-sm opacity-75">/month</span>
							</p>

							<span className="mt-auto flex items-center justify-between gap-1 pt-3">
								<span className="text-sm font-semibold">Get Started</span>
								<ExternalLink className="h-3 w-3" />
							</span>

							{isSubscribing ? (
								<div className="absolute inset-0 flex items-center justify-center backdrop-blur-md">
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							) : null}
						</article>

						<span className="flex h-full items-center text-sm opacity-75">
							or
						</span>

						<article
							onClick={() => subscribe({ length: 'yearly' })}
							className="bg-brand text-brand-foreground border-brand-glint relative flex w-[10rem] cursor-pointer flex-col overflow-hidden rounded-2xl border p-4 pb-3 shadow-sm transition-transform hover:scale-105"
						>
							<h4 className="flex items-center gap-2">Annually</h4>
							<p>
								<span className="text-md font-bold">£30.00</span>
								<span className="text-sm opacity-75">/year</span>
							</p>

							<span className="mt-auto flex items-center justify-between gap-1 pt-3">
								<span className="text-sm font-semibold">Save £27.48</span>
								<ExternalLink className="h-3 w-3" />
							</span>

							{isSubscribing ? (
								<div className="absolute inset-0 flex items-center justify-center backdrop-blur-md">
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							) : null}
						</article>
					</div>

					<p className="max-w-lg text-center text-sm opacity-75">
						You can cancel at any time - no questions asked.
						<br />
						You'll also keep access to all features until your subscription
						ends.
					</p>
				</div>
			) : null}
		</main>
	);
}
