import { tabzeroTool } from "../types";
import { twitchStreamChangeTitle } from "./twitch/change-stream-title.tool";
import { twitchStreamChangeCategory } from "./twitch/change-stream-category.tool";
import { openaiAnswerQuestion } from "./openai/answer-question.tool";
import { twitchStreamChangeChatSettings } from "./twitch/change-chat-settings.tool";
import { twitchClipCreate } from "./twitch/action-clip-create.tool";
import { twitchStreamSummary } from "./twitch/analysis-stream-summary.tool";

export const TOOLS: tabzeroTool<any>[] = [
    openaiAnswerQuestion,
    twitchStreamChangeTitle,
    twitchStreamChangeCategory,
    twitchClipCreate,
    twitchStreamSummary,
    twitchStreamChangeChatSettings,
]