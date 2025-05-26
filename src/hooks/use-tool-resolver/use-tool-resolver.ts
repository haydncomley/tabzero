import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../main';
import { useAudioPlayer } from '../use-audio-player';
import type { tabzeroToolAction } from './lib/types';

const previousTextResolutions: string[] = [];

export const useToolResolver = () => {
	const { speak } = useAudioPlayer();
	const {
		mutateAsync: resolveTools,
		data: resolvedTools,
		isPending: isResolvingTools,
	} = useMutation({
		mutationKey: ['resolveTools'],
		mutationFn: async (options: { transcription: string }) => {
			if (previousTextResolutions.includes(options.transcription)) {
				return null;
			}

			previousTextResolutions.push(options.transcription);

			const aiToolResolver = httpsCallable<
				{ prompt: string },
				{
					action: tabzeroToolAction;
				}
			>(functions, 'aiToolResolver');

			const { data } = await aiToolResolver({
				prompt: options.transcription,
			});

			return data.action;
		},
	});

	const { mutateAsync: runTools, isPending: isRunningTools } = useMutation({
		mutationKey: ['runTools'],
		mutationFn: async (options: { action: tabzeroToolAction }) => {
			const toolRunner = httpsCallable<
				{
					action: tabzeroToolAction;
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
				action: options.action,
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
