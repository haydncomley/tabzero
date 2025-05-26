import { useMemo } from 'react';

import { useAuth } from '../use-auth';
import { useSharedSnapshot } from '../use-snapshot';
import type { tabzeroToolAction } from '../use-tool-resolver/lib/types';

export const useLog = () => {
	const { details } = useAuth();
	const log = useSharedSnapshot<tabzeroToolAction>(
		details ? `users/${details.uid}/log` : undefined,
	);

	const logSorted = useMemo(
		() =>
			(log ?? []).sort(
				(a, b) =>
					b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime(),
			),
		[log],
	);

	return { log: logSorted };
};
