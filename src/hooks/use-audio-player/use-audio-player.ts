import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';
import { useCallback } from 'react';

import { functions } from '../../main';

export const useAudioPlayer = () => {
	const { mutateAsync: speak, isPending: isLoadingSpeech } = useMutation({
		mutationFn: async (options: { text: string }) => {
			const aiSpeak = httpsCallable<
				{ text: string },
				{ base64: string; contentType: string }
			>(functions, 'aiSpeak');

			const { data } = await aiSpeak({
				text: options.text,
			});

			const audio = new Audio(`data:${data.contentType};base64,${data.base64}`);
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
