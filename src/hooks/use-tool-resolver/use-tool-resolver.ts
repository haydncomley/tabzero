import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../main';
import { useAudioPlayer } from '../use-audio-player';

export const useToolResolver = () => {
	const { speak } = useAudioPlayer();
	const {
		mutateAsync: resolveTools,
		data: resolvedTools,
		isPending: isResolvingTools,
	} = useMutation({
		mutationKey: ['resolveTools'],
		mutationFn: async (options: { transcription: string }) => {
			const aiToolResolver = httpsCallable<
				{ prompt: string },
				{
					tools: {
						id: string;
						type: 'function';
						function: {
							arguments: string;
							name: string;
						};
					}[];
				}
			>(functions, 'aiToolResolver');

			const { data } = await aiToolResolver({
				prompt: options.transcription,
			});
			return data.tools;
		},
	});

	const { mutateAsync: runTools, isPending: isRunningTools } = useMutation({
		mutationKey: ['runTools'],
		mutationFn: async (options: {
			tools: {
				id: string;
				type: 'function';
				function: {
					arguments: string;
					name: string;
				};
			}[];
		}) => {
			const toolRunner = httpsCallable<
				{
					tools: {
						id: string;
						type: 'function';
						function: {
							arguments: string;
							name: string;
						};
					}[];
				},
				{
					id: string;
					result:
						| {
								success: boolean;
								message: string;
								tts?: string;
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  }
						| undefined;
				}[]
			>(functions, 'tool');

			const { data } = await toolRunner({
				tools: options.tools,
			});

			data.forEach((tool) => {
				if (tool.result?.tts) speak({ text: tool.result.tts });
			});

			return data;
		},
	});

	return {
		resolveTools,
		resolvedTools,
		isResolvingTools,
		runTools,
		isRunningTools,
	};
};
