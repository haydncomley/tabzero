import type { DocumentSnapshot } from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';

import { firestore } from '../../main';

const docListeners = new Map<
	string,
	{
		data: any;
		subscribers: Set<(data: any) => void>;
		unsub: () => void;
	}
>();

export const useDocSnapshot = <T = any>(path?: string): T | undefined => {
	const [data, setData] = useState<T | undefined>(() => {
		const entry = path && docListeners.get(path);
		return entry ? entry.data : undefined;
	});

	useEffect(() => {
		if (!path) return;

		let entry = docListeners.get(path);
		if (!entry) {
			const ref = doc(firestore, path);
			const unsub = onSnapshot(ref, (snap: DocumentSnapshot) => {
				const docData = snap.exists()
					? ({ id: snap.id, ...snap.data() } as T)
					: undefined;
				const e = docListeners.get(path)!;
				e.data = docData;
				e.subscribers.forEach((fn) => fn(docData));
			});

			entry = { data: undefined, subscribers: new Set(), unsub };
			docListeners.set(path, entry);
		}

		entry.subscribers.add(setData);
		setData(entry.data);

		return () => {
			entry!.subscribers.delete(setData);
			if (entry!.subscribers.size === 0) {
				entry!.unsub();
				docListeners.delete(path);
			}
		};
	}, [firestore, path]);

	return data;
};
