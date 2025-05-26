import { tabzeroTool } from "../types";
import { twitchStreamChangeTitle } from "./twitch/change-stream-title.tool";
import { twitchStreamChangeCategory } from "./twitch/change-stream-category.tool";

export const TOOLS: tabzeroTool<any>[] = [
    twitchStreamChangeTitle,
    twitchStreamChangeCategory,
]