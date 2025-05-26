import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { useSetting } from '../use-setting';

export const useRecorder = () => {
	const [deviceId] = useSetting('deviceId');
	const [isRecording, setIsRecording] = useState(false);
	const [audioId, setAudioId] = useState<string | null>(null);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);

	const startRecording = useCallback(() => {
		setIsRecording(true);
	}, []);

	const stopRecording = useCallback(() => {
		setIsRecording(false);
	}, []);

	useEffect(() => {
		if (!isRecording) return;

		let mediaRecorder: MediaRecorder;
		let recordedChunks: Blob[] = [];

		const startRecording = async () => {
			setAudioId(crypto.randomUUID());
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: deviceId ? { deviceId: deviceId } : true,
			});

			mediaRecorder = new MediaRecorder(stream);
			recordedChunks = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) recordedChunks.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const blob = new Blob(recordedChunks, { type: 'audio/ogg' });
				const url = URL.createObjectURL(blob);
				setAudioBlob(blob);
				setAudioUrl(url);
			};

			mediaRecorder.start();
		};
		startRecording();

		return () => {
			if (mediaRecorder && mediaRecorder.state !== 'inactive') {
				mediaRecorder.stop();
			}
		};
	}, [isRecording]);

	const { data: devices } = useQuery({
		queryKey: ['system', 'devices', 'audio'],
		queryFn: async () => {
			const devices = await navigator.mediaDevices.enumerateDevices();
			return devices.filter((device) => device.kind === 'audioinput');
		},
		initialData: [],
	});

	return {
		startRecording,
		stopRecording,
		isRecording,
		devices,
		audioBlob,
		audioUrl,
		audioId,
	};
};
