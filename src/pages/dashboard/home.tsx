import classNames from 'classnames';
import { AudioLines, Check, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';

import { useAudioPlayer } from '~/hooks/use-audio-player';
import { useLog } from '~/hooks/use-log';
import { useSpeechToText } from '~/hooks/use-speech-to-text';
import { useToolResolver } from '~/hooks/use-tool-resolver';

export default function Page() {
	const { log } = useLog();
	const { transcribe, audioUrl, transcription, isLoading, isTranscribing } =
		useSpeechToText({});
	const { resolveTools, runTools } = useToolResolver();
	const { speak } = useAudioPlayer();

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

	// const isLastTranscriptionNew = useMemo(() => {
	// 	if (!transcription) return false;
	// 	if (!log[0].text) return false;
	// 	return transcription !== log[0].text;
	// }, [transcription, log[0]?.text]);

	return (
		<main>
			<div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
				{log.map((logItem) => (
					<div
						key={logItem.id}
						className="flex flex-col gap-4 border-b pb-4"
					>
						<div className="flex flex-col">
							<p className="text-xs opacity-50">
								{logItem.timestamp.toDate().toLocaleTimeString()}
							</p>
							<p className="text-sm">{logItem.text}</p>
						</div>

						{logItem.tools.length ? (
							<div className="flex flex-wrap gap-2 overflow-auto">
								{logItem.tools.map((tool) => (
									<div
										key={tool.id}
										className={classNames(
											'flex shrink-0 items-center gap-3 rounded-xl px-3 py-2',
											{
												'bg-outline/25': tool.status !== 'pending',
												'bg-brand/25': tool.status === 'pending',
											},
										)}
									>
										{tool.status === 'pending' ? (
											<Loader2 className="h-5 w-5 animate-spin"></Loader2>
										) : tool.status === 'success' ? (
											<Check className="h-5 w-5"></Check>
										) : (
											<X className="h-5 w-5"></X>
										)}
										<div className="flex flex-col">
											<p className="text-xs font-semibold">{tool.name}</p>
											<p
												className="max-w-64 overflow-hidden text-xs overflow-ellipsis whitespace-nowrap opacity-50"
												title={tool.context}
											>
												{tool.context}
											</p>
										</div>
										{tool.tts ? (
											<button
												className="bg-brand border-brand-glint text-brand-foreground hover:bg-brand-glint cursor-pointer rounded-full border p-2 transition-all duration-75"
												onClick={() => speak({ text: tool.tts! })}
											>
												<AudioLines className="h-4 w-4"></AudioLines>
											</button>
										) : null}
									</div>
								))}
							</div>
						) : null}
					</div>
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
						{isTranscribing || !transcription ? 'Recording...' : 'Working...'}
					</p>
				</div>
			</div>
		</main>
	);
}
