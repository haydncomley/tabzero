import { useSetting } from '../use-setting';

export const useStreamDeck = () => {
	const [isStreamDeckConnected] = useSetting('streamDeck', false);

	return {
		isStreamDeckConnected,
	};
};
