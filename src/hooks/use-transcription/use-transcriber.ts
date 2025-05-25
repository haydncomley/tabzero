import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../main';
import { blobToBase64 } from './lib/blob-to-base64';

export const useTranscriber = () => {
	const {
		mutateAsync: transcribe,
		data: transcription,
		isPending: isTranscribing,
	} = useMutation({
		mutationFn: async (options: { audio: Blob; deviceId?: string }) => {
			const aiTranscribe = httpsCallable<{ audio: string }, { text: string }>(
				functions,
				'aiTranscribe',
			);

			const { data } = await aiTranscribe({
				audio: await blobToBase64(options.audio),
			});

			return data.text;
		},
	});

	return {
		transcribe,
		transcription,
		isTranscribing,
	};
};
