import { z } from "zod";
import { tabzeroTool } from "../../types";
import { HelixUpdateChatSettingsParams } from "@twurple/api";
import { HttpsError } from "firebase-functions/https";
import { getTwitch } from "../../../vendor/twitch.vendor";

const toolSchema = z.object({
    emoteOnlyEnabled: z.boolean().nullable(),
    followerOnlyEnabled: z.boolean().nullable(),
    followerOnlyDelay: z.number().nullable(),
    nonModeratorChatDelay: z.number().nullable(),
    nonModeratorChatDelayEnabled: z.boolean().nullable(),
    slowModeEnabled: z.boolean().nullable(),
    slowModeDelay: z.number().nullable(),
    subscriberOnlyModeEnabled: z.boolean().nullable(),
})

export const twitchStreamChangeChatSettings = {
    // LLM
    name: 'twitchStreamChangeChatSettings',
    description: 'Change the chat settings of the Twitch stream (emoji only, follower only, slow mode, non-moderator delay)',
    parameters: toolSchema,
    scopes: ['twitch@moderator:manage:chat_settings'],
    clientDetails: (chatSettings) => {
        const chatMode = {
            emoteOnlyEnabled: chatSettings.emoteOnlyEnabled,
            followerOnlyEnabled: chatSettings.followerOnlyEnabled,
            nonModeratorChatDelayEnabled: chatSettings.nonModeratorChatDelayEnabled,
            slowModeEnabled: chatSettings.slowModeEnabled,
            subscriberOnlyModeEnabled: chatSettings.subscriberOnlyModeEnabled,
        };

        const chatDelay = {
            followerOnlyDelay: chatSettings.followerOnlyDelay,
            nonModeratorChatDelay: chatSettings.nonModeratorChatDelay,
            slowModeDelay: chatSettings.slowModeDelay,
        };

        const modeName = Object.keys(chatMode).find(key => chatMode[key as keyof typeof chatMode]);
        const delayName = Object.keys(chatDelay).find(key => chatDelay[key as keyof typeof chatDelay]);

        const modeFormatted = modeName ? `${modeName}: ${chatMode[modeName as keyof typeof chatMode]} ` : '';
        const delayFormatted = delayName ? `${delayName}: ${chatDelay[delayName as keyof typeof chatDelay]}` : '';

        return {
            name: "Update Chat Settings",
            context: `${modeFormatted}${(modeFormatted && delayFormatted) ? ' - ' : ''}${delayFormatted}`.trim()
        };
    },
    // User
    infoName: 'Twitch: Change Chat Settings',
    infoDescription: 'Change the chat settings of your stream.',
    // Action
    function: async ({ user, ...chatSettings }) => {
        const api = getTwitch(user);
        
        const { userId } = await api.getTokenInfo();
        if (!userId) throw new HttpsError('invalid-argument', 'User validation failed');

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
            Object.entries(twitchChatSettingsPartial).filter(([_, value]) => value !== null)
        ) as HelixUpdateChatSettingsParams;

        try {
            await api.chat.updateSettings(userId, twitchChatSettings);
            return { success: true }
        } catch (error) {
            return { success: false, message: 'Failed to change chat settings' }
        }
    }
} as const satisfies tabzeroTool<typeof toolSchema>

