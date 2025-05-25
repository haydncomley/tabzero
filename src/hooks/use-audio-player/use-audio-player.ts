import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';
import { useCallback } from 'react';

import { functions } from '../../main';

let TRANSCRIPTIONS: Record<string, string> = {};

export const useAudioPlayer = () => {
	const { mutateAsync: speak, isPending: isLoadingSpeech } = useMutation({
		mutationFn: async (options: { text: string }) => {
			if (TRANSCRIPTIONS[options.text]) {
				const audio = new Audio(TRANSCRIPTIONS[options.text]);
				audio.play();
				return;
			}

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
		},
	});

	const play = useCallback((url: string) => {
		const audio = new Audio(url);
		audio.play();
	}, []);

	return {
		play,
		speak,
		isLoadingSpeech,
	};
};
