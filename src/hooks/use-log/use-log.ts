import { limit, orderBy } from 'firebase/firestore';

import { useAuth } from '../use-auth';
import { useCollectionSnapshot } from '../use-snapshot';
import type { tabzeroToolAction } from '../use-tool-resolver/lib/types';

export const useLog = () => {
	const { details } = useAuth();
	const log = useCollectionSnapshot<tabzeroToolAction>(
		details ? `users/${details.uid}/log` : undefined,
		orderBy('timestamp', 'desc'),
		limit(25),
	);

	return { log };
};
