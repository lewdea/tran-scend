// 单词学习处理模块

import type { LearnWordRequest } from '../../types';
import { API_CONFIG } from '../constants';
import { callOpenAI } from '../api/openai';
import { processStreamResponse, createStreamHandlers } from '../api/streaming';
import { buildLearnWordPrompt } from '../prompts/wordPrompt';

/**
 * 处理单词学习请求（流式返回）
 */
export async function handleLearnWord(
  request: LearnWordRequest,
  tabId: number
): Promise<void> {
  if (!tabId) {
    throw new Error('No tabId provided');
  }

  const prompt = buildLearnWordPrompt(request.text);

  const response = await callOpenAI({
    messages: [
      {
        role: 'system',
        content: 'You are an expert English teacher and linguist. Provide detailed, structured explanations of English words in Chinese, including pronunciation, meanings, etymology, and usage examples.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    maxTokens: API_CONFIG.MAX_TOKENS.WORD,
    stream: true,
  });

  const handlers = createStreamHandlers(tabId);
  await processStreamResponse(response, tabId, handlers);
}

