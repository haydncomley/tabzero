import OpenAI from 'openai';
import { observeOpenAI} from "langfuse";

import { langfuseHost, langfuseKey, langfusePublicKey, openaiKey } from '../config';

export const getOpenAI = () => {
    const openai = observeOpenAI(new OpenAI({
        apiKey: openaiKey.value(),
    }), {
        clientInitParams: {
            secretKey: langfuseKey.value(),
            publicKey: langfusePublicKey.value(),
            baseUrl: langfuseHost.value()
        }
    });

    return openai;
}