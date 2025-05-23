import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';

import { Button } from '~/components/button';
import { useHotkey } from '~/hooks/use-hotkey';

import { functions } from '../../main';

const blobToBase64 = (blob: Blob): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});

export default function Page() {
	const [isRecording, setIsRecording] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(
		null,
	);

	const { keys, remap, rebindSuccess } = useHotkey('toggleRecording', () => {
		setIsRecording((prev) => !prev);
	});

	const { data } = useQuery({
		queryKey: ['system', 'devices', 'audio'],
		queryFn: async () => {
			const devices = await navigator.mediaDevices.enumerateDevices();
			return devices.filter((device) => device.kind === 'audioinput');
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
					deviceId: selectedDevice?.deviceId,
				},
			});

			mediaRecorder = new MediaRecorder(stream);
			recordedChunks = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) recordedChunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const blob = new Blob(recordedChunks, { type: 'audio/ogg' });
				const url = URL.createObjectURL(blob);
				const audio = new Audio(url);
				audio.play();

				const aiTranscribe = httpsCallable<{ audio: string }, { text: string }>(
					functions,
					'aiTranscribe',
				);

				const { data } = await aiTranscribe({
					audio: await blobToBase64(blob),
				});

				console.log(data.text);
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

	const { mutate } = useMutation({
		mutationFn: async () => {
			const aiTest = httpsCallable<{ prompt: string }, { tools: any }>(
				functions,
				'aiToolResolver',
			);

			const { data } = await aiTest({
				prompt:
					'Set my chat to be emote only, and update my title to be "Hello, world!"',
			});

			console.log(data.tools);

			return data;
		},
	});

	return (
		<main className="p-4">
			<div className="flex flex-col items-start gap-4">
				<select
					className="rounded-xl border p-2"
					onChange={(e) =>
						setSelectedDevice(
							data.find((device) => device.deviceId === e.target.value) ?? null,
						)
					}
				>
					{data.map((device) => (
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
					className={classNames('rounded-xl border p-2', {
						'border-danger': !rebindSuccess,
					})}
					defaultValue={keys}
					onBlur={(e) => remap(e.currentTarget.value)}
				/>

				<Button onClick={() => setIsRecording((prev) => !prev)}>
					{isRecording ? 'Stop' : 'Start'}
				</Button>
				<Button onClick={() => mutate()}>Hellio world</Button>
			</div>
		</main>
	);
}
