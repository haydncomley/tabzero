import { useMutation } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../main';
import { useAuth } from '../use-auth';

export const useToolResolver = () => {
	const { userDetails } = useAuth();
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

			console.log('Tools Wanted', data.tools);

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
			console.log(userDetails);
			const toolRunner = httpsCallable<
				{
					token: string;
					tools: {
						id: string;
						type: 'function';
						function: {
							arguments: string;
							name: string;
						};
					}[];
				},
				any
			>(functions, 'tool');

			const { data } = await toolRunner({
				tools: options.tools,
				token: userDetails?.providers[userDetails.provider].access_token!,
			});

			console.log('Tools Ran', data);

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
