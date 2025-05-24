import { tabzeroTool } from "../types";
import { twitchStreamChangeTitle } from "./twitch/change-stream-title.tool";

export const TOOLS: tabzeroTool<any>[] = [
    twitchStreamChangeTitle,
]