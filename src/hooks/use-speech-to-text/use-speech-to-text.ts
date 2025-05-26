import { useMemo } from 'react';

import { useDebounce } from '../use-debounce';
import { useHotkey } from '../use-hotkey';
import type { HOTKEYS } from '../use-hotkey/lib/constants';
import { useRecorder } from '../use-recorder';
import { useTranscriber } from '../use-transcription';

export const useSpeechToText = ({
	hotkey = 'toggleRecording',
}: {
	hotkey?: keyof typeof HOTKEYS;
}) => {
	const {
		startRecording,
		stopRecording,
		isRecording,
		audioBlob,
		devices,
		audioUrl,
	} = useRecorder();

	const isRecordingDebounced = useDebounce(isRecording, 150);
	const { transcribe, isTranscribing, transcription } = useTranscriber();

	const toggleRecording = useMemo(() => {
		if (!isRecording) return startRecording;
		else return stopRecording;
	}, [isRecording]);

	useHotkey(hotkey, () => {
		if (!isRecording) startRecording();
		else stopRecording();
	}, [isRecording]);

	const state = useMemo<'recording' | 'transcribing' | 'idle' | 'done'>(() => {
		if (isRecording) return 'recording';
		if (isTranscribing) return 'transcribing';
		if (!transcription) return 'idle';
		return 'done';
	}, [transcription, isTranscribing, isRecording]);

	const isLoading = useMemo(() => {
		if (isRecording || isRecordingDebounced) return true;
		if (isTranscribing) return true;
		return false;
	}, [isRecording, isTranscribing, isRecordingDebounced]);

	return {
		state,
		transcribe: () => {
			if (!audioBlob) return Promise.resolve(null);
			return transcribe({ audio: audioBlob });
		},
		transcription,
		audioUrl,
		toggleRecording,
		startRecording,
		stopRecording,
		isTranscribing,
		isLoading,
		devices,
	};
};
