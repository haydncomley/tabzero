import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { Button } from '~/components/button';
import { useAuth } from '~/hooks/use-auth';
import { useHotkey } from '~/hooks/use-hotkey';

export default function Page() {
	const { details } = useAuth();
	const [isRecording, setIsRecording] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<MediaStreamTrack | null>(
		null,
	);

	const { keys, remap, rebindSuccess } = useHotkey('toggleRecording', () => {
		setIsRecording((prev) => !prev);
	});

	const { data } = useQuery({
		queryKey: ['system', 'devices', 'audio'],
		queryFn: async () => {
			const devices = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});

			return devices.getAudioTracks();
		},
		initialData: [],
	});

	useEffect(() => {
		if (!isRecording) return;

		let mediaRecorder: MediaRecorder;
		let recordedChunks: Blob[] = [];

		const startRecording = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					deviceId: selectedDevice?.id,
				},
			});

			mediaRecorder = new MediaRecorder(stream);
			recordedChunks = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) recordedChunks.push(event.data);
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(recordedChunks, { type: 'audio/wav' });
				const url = URL.createObjectURL(blob);
				const audio = new Audio(url);
				audio.play();
			};

			mediaRecorder.start();
		};
		startRecording();

		return () => {
			if (mediaRecorder && mediaRecorder.state !== 'inactive') {
				mediaRecorder.stop();
				console.log('Recording stopped');
			}
		};
	}, [isRecording]);

	return (
		<main className="p-4">
			<div className="flex flex-col items-start gap-4">
				<select
					className="rounded-xl border p-2"
					onChange={(e) =>
						setSelectedDevice(
							data.find((device) => device.id === e.target.value) ?? null,
						)
					}
				>
					{data.map((device) => (
						<option
							value={device.id}
							key={device.id}
						>
							{device.label}
						</option>
					))}
				</select>

				<input
					type="text"
					className={classNames('rounded-xl border p-2', {
						'border-danger': !rebindSuccess,
					})}
					defaultValue={keys}
					onBlur={(e) => remap(e.currentTarget.value)}
				/>

				<Button onClick={() => setIsRecording((prev) => !prev)}>
					{isRecording ? 'Stop' : 'Start'}
				</Button>
			</div>
		</main>
	);
}
