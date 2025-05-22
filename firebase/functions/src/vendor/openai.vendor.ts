import OpenAI from 'openai';
import { CONFIG } from '../config';

export const getOpenAI = () => {
    const openai = new OpenAI({
        apiKey: CONFIG.openai.key,
    });

    return openai;
}