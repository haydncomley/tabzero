import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import { tabzeroUser } from "../lib/types";
import { twitchClientId } from "../config";

export const getTwitch = (user: tabzeroUser) => {
    const provider = new StaticAuthProvider(twitchClientId.value(), user.providers.twitch.access_token);
    const api = new ApiClient({ authProvider: provider });
    return api;
}