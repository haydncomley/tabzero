import type {
	FirestoreDataConverter,
	DocumentData,
	QueryDocumentSnapshot,
} from 'firebase/firestore';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

import type { tabzeroUser } from './types';

export const userConverter: FirestoreDataConverter<tabzeroUser> = {
	toFirestore(data: tabzeroUser): DocumentData {
		return {
			...data,
			timestamp_last: serverTimestamp(),
			timestamp_created: Timestamp.fromDate(data.timestamp_created),
		};
	},
	fromFirestore(snapshot: QueryDocumentSnapshot) {
		const data = snapshot.data();
		let timestamp_last: Date | undefined = undefined;
		let timestamp_created: Date | undefined = undefined;
		console.log('Converting', data);

		if (data.timestamp_last instanceof Timestamp)
			timestamp_last = data.timestamp_last.toDate();
		if (data.timestamp_created instanceof Timestamp)
			timestamp_created = data.timestamp_last.toDate();

		return {
			...data,
			timestamp_last,
			timestamp_created,
		} as tabzeroUser;
	},
};
