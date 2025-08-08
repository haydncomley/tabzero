import { tabzeroTool } from '../types';
import { twitchStreamChangeTitle } from './twitch/change-stream-title.tool';
import { twitchStreamChangeCategory } from './twitch/change-stream-category.tool';
import { openaiAnswerQuestion } from './openai/answer-question.tool';
import { twitchStreamChangeChatSettings } from './twitch/change-chat-settings.tool';
import { twitchClipCreate } from './twitch/action-clip-create.tool';
import { twitchStreamSummary } from './twitch/analysis-stream-summary.tool';
import { twitchStreamUserTimeout } from './twitch/user-timeout.tool';
import { twitchStreamUserBan } from './twitch/user-ban.tool';
import { openaiSimonSays } from './openai/simon-says.tool';
import { twitchStreamChatSummary } from './twitch/analysis-chat-summary.tool copy';
import { twitchStreamUserCallout } from './twitch/user-callout.tool';
import { twitchStreamUserCheerTTS } from './twitch/user-cheer-tts.tool';

export const TOOLS: tabzeroTool<any>[] = [
	openaiAnswerQuestion,
	openaiSimonSays,
	twitchStreamChangeTitle,
	twitchStreamChangeCategory,
	twitchClipCreate,
	twitchStreamSummary,
	twitchStreamChatSummary,
	twitchStreamChangeChatSettings,
	twitchStreamUserTimeout,
	twitchStreamUserBan,
	twitchStreamUserCallout,
	twitchStreamUserCheerTTS,
];
