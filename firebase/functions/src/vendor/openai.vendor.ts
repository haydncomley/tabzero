import OpenAI from 'openai';
import { openaiKey } from '../config';

export const getOpenAI = () => {
    const openai = new OpenAI({
        apiKey: openaiKey.value(),
    });

    return openai;
}