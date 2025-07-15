import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { createContext, useEffect, useContext, useState } from 'react';

import { useAuth } from '../use-auth';

export const getTwitch = (token: string) => {
	const provider = new StaticAuthProvider(
		'wf0v2o5emovybh5acdn3s1r9c4g8gj',
		token,
	);
	const api = new ApiClient({ authProvider: provider });
	return api;
};

export const twitchContext = createContext<{
	isLive: boolean;
	viewerCount: number;
	chatMessages: {
		user: string;
		message: string;
		id: string;
	}[];
}>({
	isLive: false,
	viewerCount: 0,
	chatMessages: [],
});

export const TwitchProvider = ({ children }: { children: React.ReactNode }) => {
	const { details } = useAuth();
	const [isLive, setIsLive] = useState(false);
	const [viewerCount, setViewerCount] = useState(0);
	const [chatMessages, setChatMessages] = useState<
		{
			user: string;
			message: string;
			id: string;
		}[]
	>([]);

	useEffect(() => {
		if (!details) {
			setIsLive(false);
			setViewerCount(0);
			return;
		}

		const twitch = getTwitch(details.token);
		const getLiveDetails = async () => {
			const stream = await twitch.streams.getStreamByUserId(details.id);
			setIsLive(stream !== null);
			setViewerCount(stream?.viewers ?? 0);
		};

		getLiveDetails();
		const interval = setInterval(() => {
			getLiveDetails();
		}, 10_000);

		const chatClient = new ChatClient({
			channels: [details.user_name],
		});

		chatClient.connect();
		chatClient.onMessage((_channel, user, message, msg) => {
			setChatMessages((prev) => [
				{ user, message, id: msg.id },
				...prev.slice(-100),
			]);
		});

		return () => {
			clearInterval(interval);
			chatClient.quit();
		};
	}, [details?.uid]);

	return (
		<twitchContext.Provider
			value={{
				isLive,
				viewerCount,
				chatMessages,
			}}
		>
			{children}
		</twitchContext.Provider>
	);
};

export const useTwitch = () => useContext(twitchContext);
