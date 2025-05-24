import classNames from 'classnames';
import { Circle, CircleDot } from 'lucide-react';

import { Button } from '~/components/button';
import { useAudioPlayer } from '~/hooks/use-audio-player';
import { useHotkey } from '~/hooks/use-hotkey';
import { useSpeechToText } from '~/hooks/use-speech-to-text';
import { useToolResolver } from '~/hooks/use-tool-resolver';

export default function Page() {
	const { keys, rebindSuccess, remap } = useHotkey('toggleRecording');
	const { speak, isLoadingSpeech } = useAudioPlayer();
	const { toggleRecording, devices, state, isLoading, transcription } =
		useSpeechToText({
			hotkey: 'toggleRecording',
		});

	const {
		resolveTools,
		isResolvingTools,
		resolvedTools,
		runTools,
		isRunningTools,
	} = useToolResolver();

	return (
		<main className="p-4">
			<div className="flex flex-1 flex-col items-start gap-4">
				<div className="flex w-full items-center gap-2">
					<select className="h-10 w-full rounded-xl border p-2">
						{devices.map((device) => (
							<option
								value={device.deviceId}
								key={device.deviceId}
							>
								{device.label}
							</option>
						))}
					</select>

					<input
						type="text"
						className={classNames('h-10 w-full rounded-xl border p-2', {
							'border-danger': !rebindSuccess,
						})}
						defaultValue={keys}
						onBlur={(e) => remap(e.currentTarget.value)}
					/>
				</div>

				<div className="flex w-full items-center gap-2">
					<Button onClick={() => toggleRecording()}>
						{state === 'recording' ? 'Stop' : 'Start'}
						{state === 'recording' ? (
							<CircleDot className="h-4 w-4" />
						) : (
							<Circle className="h-4 w-4" />
						)}
					</Button>

					{transcription ? (
						<Button onClick={() => resolveTools({ transcription })}>
							{isResolvingTools ? 'Resolving...' : 'Resolve'}
						</Button>
					) : null}

					{transcription ? (
						<Button onClick={() => speak({ text: transcription })}>
							{isLoadingSpeech ? 'Speaking...' : 'Speak'}
						</Button>
					) : null}

					{resolvedTools ? (
						<Button onClick={() => runTools({ tools: resolvedTools })}>
							{isRunningTools ? 'Running...' : 'Run'}
						</Button>
					) : null}
				</div>

				<div className="flex h-full w-full gap-2">
					<textarea
						className="h-full w-full resize-none rounded-xl border p-2"
						disabled
						value={isLoading ? state : (transcription ?? 'Idle...')}
					></textarea>
					<div className="h-full w-full resize-none rounded-xl border p-2">
						{resolvedTools?.map((tool) => (
							<div key={tool.id}>
								<p>{tool.function.name}</p>
								<small>{tool.function.arguments}</small>
							</div>
						))}
						{resolvedTools?.length === 0 ? <div>No tools found</div> : null}
					</div>
				</div>
			</div>
		</main>
	);
}
