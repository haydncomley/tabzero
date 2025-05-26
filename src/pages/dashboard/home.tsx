import classNames from 'classnames';
import { CircleFadingArrowUp, Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { Button } from '~/components/button';
import { EventLog } from '~/components/event-log';
import { useAuth } from '~/hooks/use-auth';
import { useLog } from '~/hooks/use-log';
import { useSpeechToText } from '~/hooks/use-speech-to-text';
import { useToolResolver } from '~/hooks/use-tool-resolver';

export default function Page() {
	const { subscribe, isSubscribing, details } = useAuth();
	const { log } = useLog();
	const {
		transcribe,
		audioUrl,
		transcription,
		isLoading,
		isTranscribing,
		state,
	} = useSpeechToText({});
	const { resolveTools, runTools } = useToolResolver();

	useEffect(() => {
		if (!audioUrl) return;
		transcribe().then((transcription) => {
			if (!transcription) return;
			resolveTools({ transcription }).then((action) => {
				if (!action) return;
				runTools({ action });
			});
		});
	}, [audioUrl]);

	const isLastTranscriptionNew = useMemo(() => {
		if (!transcription) return false;
		if (!log[0].text) return false;
		return transcription !== log[0].text;
	}, [transcription, log[0]?.text]);

	return (
		<main className="relative">
			<div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
				{isLoading || isLastTranscriptionNew ? (
					<EventLog
						date="Processing..."
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

			<div
				className={classNames(
					'fixed right-0 bottom-0 p-4 transition-all duration-150',
					{
						'translate-x-full opacity-0': !isLoading,
					},
				)}
			>
				<div className="bg-brand border-brand-glint text-brand-foreground flex items-center gap-2 rounded-xl border p-2">
					<Loader2 className="h-4 w-4 animate-spin"></Loader2>
					<p className="text-sm">
						{state === 'recording' ? 'Listening...' : 'Working...'}
					</p>
				</div>
			</div>

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
