// 中文翻译处理模块

import type { TranslateRequest } from '../../types';
import { API_CONFIG } from '../constants';
import { callOpenAI } from '../api/openai';
import { processStreamResponse, createTranslateHandlers } from '../api/streaming';
import { buildTranslatePrompt } from '../prompts/translatePrompt';

/**
 * 处理中文翻译请求（流式返回）
 */
export async function handleTranslate(
  request: TranslateRequest,
  tabId: number,
  signal?: AbortSignal
): Promise<void> {
  if (!tabId) {
    throw new Error('No tabId provided');
  }

  const prompt = buildTranslatePrompt(request.text);

  const response = await callOpenAI({
    messages: [
      {
        role: 'system',
        content: 'You are an expert English translator and linguist specializing in translating Chinese to native, idiomatic English. You provide the most natural English expressions with detailed explanations and alternative options.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    maxTokens: API_CONFIG.MAX_TOKENS.TRANSLATION,
    stream: true,
    signal,
  });

  const handlers = createTranslateHandlers(tabId);
  await processStreamResponse(response, tabId, handlers, signal);
}

