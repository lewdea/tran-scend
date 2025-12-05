// 短句学习处理模块

import type { LearnPhraseRequest } from '../../types';
import { API_CONFIG } from '../constants';
import { callOpenAI } from '../api/openai';
import { processStreamResponse, createStreamHandlers } from '../api/streaming';
import { buildLearnPhrasePrompt } from '../prompts/phrasePrompt';

/**
 * 处理短句学习请求（流式返回）
 */
export async function handleLearnPhrase(
  request: LearnPhraseRequest,
  tabId: number,
  signal?: AbortSignal
): Promise<void> {
  if (!tabId) {
    throw new Error('No tabId provided');
  }

  const prompt = buildLearnPhrasePrompt(request.text);

  const response = await callOpenAI({
    messages: [
      {
        role: 'system',
        content: 'You are an expert English teacher. You explain English phrases and sentences in a clear, structured way for Chinese learners.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    maxTokens: API_CONFIG.MAX_TOKENS.PHRASE,
    stream: true,
    signal,
  });

  const handlers = createStreamHandlers(tabId);
  await processStreamResponse(response, tabId, handlers, signal);
}
