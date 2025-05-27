import { useMutation, useQuery } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';
import { useCallback, useState } from 'react';

import { functions, queryClient } from '../../main';

let TRANSCRIPTIONS: Record<string, string> = {};
let TRANSCRIPTION_STATE: Record<string, number | undefined> = {};
let TRANSCRIPTION_AUDIO: Record<string, HTMLAudioElement | undefined> = {};

export const useAudioPlayer = () => {
	const [, setValue] = useState(0);

	const { mutateAsync: speak, isPending: isLoadingSpeech } = useMutation({
		mutationFn: async (options: { text: string }) => {
			const hasAudio = TRANSCRIPTION_AUDIO[options.text];
			if (hasAudio) {
				hasAudio.currentTime = hasAudio.duration;
				return;
			}

			TRANSCRIPTION_STATE[options.text] = 0;

			if (TRANSCRIPTIONS[options.text]) {
				const audio = new Audio(TRANSCRIPTIONS[options.text]);
				TRANSCRIPTION_AUDIO[options.text] = audio;
				audio.play();
				audio.onloadedmetadata = () => {
					TRANSCRIPTION_STATE[options.text] = audio.duration;
					queryClient.invalidateQueries({ queryKey: ['audioState'] });
					setValue((prev) => prev + 1);
				};
				audio.onended = () => {
					TRANSCRIPTION_AUDIO[options.text] = undefined;
					TRANSCRIPTION_STATE[options.text] = undefined;
					queryClient.invalidateQueries({ queryKey: ['audioState'] });
					setValue((prev) => prev + 1);
				};
				return;
			}

			queryClient.invalidateQueries({ queryKey: ['audioState'] });
			const aiSpeak = httpsCallable<
				{ text: string },
				{ base64: string; contentType: string }
			>(functions, 'aiSpeak');

			const { data } = await aiSpeak({
				text: options.text,
			});

			TRANSCRIPTIONS[options.text] =
				`data:${data.contentType};base64,${data.base64}`;
			const audio = new Audio(TRANSCRIPTIONS[options.text]);
			audio.play();
			TRANSCRIPTION_AUDIO[options.text] = audio;
			TRANSCRIPTION_STATE[options.text] = audio.duration;
			audio.onloadedmetadata = () => {
				TRANSCRIPTION_STATE[options.text] = audio.duration;
				queryClient.invalidateQueries({ queryKey: ['audioState'] });
				setValue((prev) => prev + 1);
			};
			audio.onended = () => {
				TRANSCRIPTION_AUDIO[options.text] = undefined;
				TRANSCRIPTION_STATE[options.text] = undefined;
				queryClient.invalidateQueries({ queryKey: ['audioState'] });
				setValue((prev) => prev + 1);
			};
		},
	});

	const { data: audioState } = useQuery({
		queryKey: ['audioState'],
		queryFn: () => TRANSCRIPTION_STATE,
		initialData: TRANSCRIPTION_STATE,
	});

	const play = useCallback((url: string) => {
		console.log('play!');
		const audio = new Audio(url);
		audio.play();
		audio.onended = () => {
			audio.remove();
		};
	}, []);

	return {
		play,
		speak,
		isLoadingSpeech,
		audioState,
	};
};
