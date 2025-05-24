import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../main';

export const useToolResolver = () => {
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
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  }
						| undefined;
				}[]
			>(functions, 'tool');

			const { data } = await toolRunner({
				tools: options.tools,
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
