import classNames from 'classnames';
import {
	AudioLines,
	CircleFadingArrowUp,
	HelpCircle,
	Loader2,
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
import { useToolResolver } from '~/hooks/use-tool-resolver';
import { useTwitch } from '~/hooks/use-twitch';

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
							<AudioLines className="h-4 w-4 text-inherit"></AudioLines>
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
					{toolList.map((tool) => (
						<div
							key={tool.name}
							className="rounded-lg border p-2.5 px-3"
						>
							<p className="text-xs font-semibold">{tool.name}</p>
							<p className="text-xs opacity-75">{tool.description}</p>
						</div>
					))}
				</div>
			</div>

			{/* First Subscription Overlay */}
			{!details?.isSubscribed ? (
				<div className="bg-background/50 absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-6 backdrop-blur-xs">
					<h1 className="text-center text-xl">
						Welcome to <b className="font-bold">tabzero</b> early access.
						<br />
						<small className="text-sm">
							AI Stream Assistant - Never tab out again.
						</small>
					</h1>
					<Button
						onClick={() => subscribe()}
						loading={isSubscribing}
					>
						<CircleFadingArrowUp></CircleFadingArrowUp>
						Subscribe Now
					</Button>

					<p className="max-w-lg text-center text-sm opacity-75">
						You can cancel at any time, no questions asked.
						<br />
						You'll also keep access to all features until your subscription
						ends.
					</p>
				</div>
			) : null}
		</main>
	);
}
