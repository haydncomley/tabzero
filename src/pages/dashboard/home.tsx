import classNames from 'classnames';
import { AudioLines, Check, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';

import { useAudioPlayer } from '~/hooks/use-audio-player';
import { useLog } from '~/hooks/use-log';
import { useSpeechToText } from '~/hooks/use-speech-to-text';
import { useToolResolver } from '~/hooks/use-tool-resolver';

export default function Page() {
	const { log } = useLog();
	const { transcription, transcribe } = useSpeechToText({});
	const { resolveTools, runTools } = useToolResolver();
	const { speak } = useAudioPlayer();

	useEffect(() => {
		if (!transcription) return;
		transcribe().then((transcription) => {
			if (!transcription) return;
			resolveTools({ transcription }).then((action) => {
				if (!action) return;
				runTools({ action });
			});
		});
	}, [transcription]);

	console.log(log);

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

						<div className="flex flex-wrap gap-2 overflow-auto">
							{logItem.tools.map((tool) => (
								<div
									key={tool.id}
									className={classNames(
										'flex shrink-0 items-center gap-4 rounded-xl px-4 py-2.5',
										{
											'bg-outline/25': tool.status !== 'pending',
											'bg-brand/25': tool.status === 'pending',
										},
									)}
								>
									{tool.status === 'pending' ? (
										<Loader2 className="animate-spin"></Loader2>
									) : tool.status === 'success' ? (
										<Check></Check>
									) : (
										<X></X>
									)}
									<div className="flex flex-col">
										<p className="text-sm font-semibold">{tool.name}</p>
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
					</div>
				))}
			</div>
		</main>
	);
}
