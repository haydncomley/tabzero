import { collection, onSnapshot, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';

import { firestore } from '../../main';

const listeners = new Map();

export const useSharedSnapshot = <T>(path?: string) => {
	const [data, setData] = useState(() => {
		const entry = listeners.get(path);
		return entry ? entry.data : [];
	});

	useEffect(() => {
		if (!path) return;
		console.log('path', path);

		let entry = listeners.get(path);

		if (!entry) {
			// first subscriber: set up listener
			const q = query(collection(firestore, path));
			const unsub = onSnapshot(q, (snap) => {
				const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
				const e = listeners.get(path);
				e.data = docs;
				e.subscribers.forEach((fn: any) => fn(docs));
			});
			entry = { data: [], subscribers: new Set(), unsub };
			listeners.set(path, entry);
		}

		// subscribe to updates
		entry.subscribers.add(setData);
		// push current value immediately
		setData(entry.data);

		return () => {
			entry.subscribers.delete(setData);
			if (entry.subscribers.size === 0) {
				// no more users → clean up
				entry.unsub();
				listeners.delete(path);
			}
		};
	}, [path]);

	return data as T[];
};
