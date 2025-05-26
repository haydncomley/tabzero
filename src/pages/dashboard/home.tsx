import classNames from 'classnames';
import {
	AudioLines,
	CircleFadingArrowUp,
	Info,
	Loader2,
	Send,
	Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '~/components/button';
import { EventLog } from '~/components/event-log';
import { useAuth } from '~/hooks/use-auth';
import { useLog } from '~/hooks/use-log';
import { useMeta } from '~/hooks/use-meta';
import { useSpeechToText } from '~/hooks/use-speech-to-text';
import { useToolResolver } from '~/hooks/use-tool-resolver';

export default function Page() {
	const { subscribe, isSubscribing, details } = useAuth();
	const { toolList } = useMeta();
	const { log } = useLog();
	const { transcribe, audioUrl, transcription, state, toggleRecording } =
		useSpeechToText({});
	const { resolveTools, runTools, isRunningTools, isResolvingTools } =
		useToolResolver();
	const [showInfo, setShowInfo] = useState(false);

	const isLoading =
		isResolvingTools ||
		isRunningTools ||
		state === 'transcribing' ||
		state === 'recording';

	const isLoadingResolver =
		isResolvingTools || state === 'transcribing' || state === 'recording';

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

	// const isLastTranscriptionNew = useMemo(() => {
	// 	console.log(transcription, log[0]?.text);
	// 	if (!transcription) return false;
	// 	if (!log[0].text) return false;
	// 	return transcription !== log[0].text;
	// }, [transcription, log[0]?.text]);

	return (
		<main className="relative">
			<div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
				{isLoadingResolver ? (
					<EventLog
						date="Just Now"
						text={
							state === 'recording'
								? 'Listening...'
								: state === 'done' && transcription
									? transcription
									: 'Working...'
						}
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

			{/* Text Entry */}
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
					variant={showInfo ? 'primary' : 'secondary'}
				>
					<Info className="h-4 w-4 shrink-0"></Info>
				</Button>

				<div
					className={classNames(
						'shadow-brand/25 flex w-50 items-center gap-3 rounded-xl border px-4 py-2 shadow-md transition-all duration-150',
						{
							'bg-brand text-brand-foreground border-brand-glint focus-within:w-sm':
								!isLoading,
							'bg-background text-foreground border-outline': isLoading,
						},
					)}
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 shrink-0 animate-spin"></Loader2>
					) : (
						<Send className="h-4 w-4 shrink-0"></Send>
					)}
					{!isLoading ? (
						<input
							disabled={isLoading}
							type="text"
							name="prompt"
							id="prompt"
							placeholder="Prompt..."
							className="placeholder:text-brand-foreground/50 w-full appearance-none bg-transparent text-sm font-normal text-inherit outline-none"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									sendPrompt(e.currentTarget.value);
									e.currentTarget.value = '';
								}
							}}
						/>
					) : (
						<p className="w-full text-sm">
							{state === 'recording' ? 'Listening...' : 'Working...'}
						</p>
					)}

					<button
						className={classNames(
							'-mr-2 cursor-pointer rounded-full border p-1 transition-all duration-75',
							{
								'bg-brand-glint text-brand-foreground border-brand-glint/50 hover:scale-110':
									state !== 'recording' && !isLoadingTools,
								'bg-background text-foreground border-outline': isLoadingTools,
								'bg-brand text-brand-foreground border-brand-glint hover:scale-125':
									state === 'recording',
							},
						)}
						onClick={() => {
							toggleRecording();
						}}
					>
						<AudioLines className="h-4 w-4"></AudioLines>
					</button>
				</div>
			</div>

			{/* Capabilities Sheet  */}
			<div
				className={classNames(
					'bg-background text-foreground border-brand absolute bottom-0 left-4 z-10 w-sm overflow-hidden rounded-t-xl border border-b-0 transition-all duration-150',
					{
						'translate-y-full': !showInfo,
					},
				)}
			>
				<div className="border-b px-3 py-2">
					<p className="flex items-center gap-2 font-bold">
						<Sparkles className="h-4 w-4"></Sparkles>
						AI Capabilities
						<Sparkles className="h-4 w-4"></Sparkles>
					</p>
				</div>

				<div className="flex gap-2 p-3">
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

					<p className="max-w-lg text-center text-sm opacity-50">
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
