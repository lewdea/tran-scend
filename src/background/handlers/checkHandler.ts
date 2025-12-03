// 英文检查处理模块

import type { CheckRequest } from '../../types';
import { API_CONFIG } from '../constants';
import { callOpenAI } from '../api/openai';
import { processStreamResponse, createCheckHandlers } from '../api/streaming';
import { buildCheckPrompt } from '../prompts/checkPrompt';

/**
 * 处理英文检查请求（流式返回）
 */
export async function handleCheck(
  request: CheckRequest,
  tabId: number
): Promise<void> {
  if (!tabId) {
    throw new Error('No tabId provided');
  }

  const prompt = buildCheckPrompt(request.text);

  const response = await callOpenAI({
    messages: [
      {
        role: 'system',
        content: 'You are an expert English language editor and native speaker consultant. You evaluate English expressions for clarity and naturalness, providing detailed feedback and the most idiomatic alternatives.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    maxTokens: API_CONFIG.MAX_TOKENS.CHECK,
    stream: true,
  });

  const handlers = createCheckHandlers(tabId);
  await processStreamResponse(response, tabId, handlers);
}

