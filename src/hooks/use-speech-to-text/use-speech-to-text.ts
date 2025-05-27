import { useCallback, useMemo } from 'react';

import { useAudioPlayer } from '../use-audio-player';
import { SOUND_OFF, SOUND_ON } from '../use-audio-player/lib/constants';
import { useDebounce } from '../use-debounce';
import { useRecorder } from '../use-recorder';
import { useTranscriber } from '../use-transcription';

export const useSpeechToText = () => {
	const { play } = useAudioPlayer();
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

	const toggleRecording = useCallback(() => {
		if (!isRecording) {
			startRecording();
			play(SOUND_ON);
		} else {
			stopRecording();
			play(SOUND_OFF);
		}
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
