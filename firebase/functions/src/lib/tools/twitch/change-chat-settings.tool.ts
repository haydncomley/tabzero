import { z } from 'zod';
import { tabzeroTool } from '../../types';
import { HelixUpdateChatSettingsParams } from '@twurple/api';
import { HttpsError } from 'firebase-functions/https';
import { getTwitch } from '../../../vendor/twitch.vendor';

const toolSchema = z.object({
	emoteOnlyEnabled: z.boolean().nullable(),
	followerOnlyEnabled: z.boolean().nullable(),
	followerOnlyDelay: z.number().nullable(),
	nonModeratorChatDelay: z.number().nullable(),
	nonModeratorChatDelayEnabled: z.boolean().nullable(),
	slowModeEnabled: z.boolean().nullable(),
	slowModeDelay: z.number().nullable(),
	subscriberOnlyModeEnabled: z.boolean().nullable(),
});

export const twitchStreamChangeChatSettings = {
	// LLM
	name: 'twitchStreamChangeChatSettings',
	description:
		'Change the chat settings of the Twitch stream (emoji only, follower only, slow mode, non-moderator delay)',
	parameters: toolSchema,
	scopes: ['twitch@moderator:manage:chat_settings'],
	clientDetails: () => {
		return {
			name: 'Update Chat Settings',
			context: `Updating...`,
		};
	},
	// User
	infoName: 'Twitch: Change Chat Settings',
	infoDescription: 'Change the chat settings of your stream.',
	// Action
	function: async ({ user, ...chatSettings }) => {
		const api = getTwitch(user);

		const { userId } = await api.getTokenInfo();
		if (!userId)
			throw new HttpsError('invalid-argument', 'User validation failed');

		const twitchChatSettingsPartial = {
			emoteOnlyModeEnabled: chatSettings.emoteOnlyEnabled,
			followerOnlyModeDelay: chatSettings.followerOnlyDelay,
			followerOnlyModeEnabled: chatSettings.followerOnlyEnabled,
			nonModeratorChatDelay: chatSettings.nonModeratorChatDelay,
			nonModeratorChatDelayEnabled: chatSettings.nonModeratorChatDelayEnabled,
			slowModeDelay: chatSettings.slowModeDelay,
			slowModeEnabled: chatSettings.slowModeEnabled,
			subscriberOnlyModeEnabled: chatSettings.subscriberOnlyModeEnabled,
		};

		const twitchChatSettings = Object.fromEntries(
			Object.entries(twitchChatSettingsPartial).filter(
				([_, value]) => value !== null,
			),
		) as HelixUpdateChatSettingsParams;

		const chatSettingsString = Object.entries(twitchChatSettingsPartial)
			.filter(([_, value]) => typeof value === 'boolean')
			.map(([key, value]) => `${key}: ${value ? 'On' : 'Off'}`)
			.join(', ');

		try {
			await api.chat.updateSettings(userId, twitchChatSettings);
			return { success: true, message: chatSettingsString };
		} catch (error) {
			return { success: false, message: 'Failed to change chat settings' };
		}
	},
} as const satisfies tabzeroTool<typeof toolSchema>;
