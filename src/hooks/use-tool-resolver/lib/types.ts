import type { Timestamp } from 'firebase/firestore';

export type tabzeroToolAction = {
	id: string;
	name: string;
	text: string;
	timestamp: Timestamp;
	tools: {
		id: string;
		name: string;
		context: string;
		status: 'pending' | 'success' | 'error';
		tts?: string;
		link?: string;
		details: {
			arguments: string;
			name: string;
		};
	}[];
};
