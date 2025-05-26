import { useQuery } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../main';
import { useAuth } from '../use-auth';

export const useMeta = () => {
	const { user } = useAuth();

	const { data: version } = useQuery({
		queryKey: ['meta', 'version'],
		queryFn: async () => {
			const meta = httpsCallable<
				void,
				{
					version: string;
				}
			>(functions, 'metaVersion');
			const { data } = await meta();
			return data.version;
		},
		enabled: !!user,
	});

	const { data: toolList } = useQuery({
		queryKey: ['meta', 'capabilities'],
		queryFn: async () => {
			const tools = httpsCallable<
				void,
				{ name: string; description: string }[]
			>(functions, 'metaCapabilities');
			const { data } = await tools();
			return data ?? [];
		},
		initialData: [],
		enabled: !!user,
	});

	return {
		toolList,
		version,
	};
};
