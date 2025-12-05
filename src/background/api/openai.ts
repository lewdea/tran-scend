// OpenAI API 调用模块

import type { OpenAIMessage } from '../../types';
import { API_CONFIG } from '../constants';
import { getApiConfig } from '../../utils/storage';

export interface OpenAIRequestOptions {
  messages: OpenAIMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  signal?: AbortSignal;
}

export interface OpenAIResponse {
  choices: Array<{
    message?: { content: string };
    delta?: { content?: string };
  }>;
}

/**
 * 调用 OpenAI API
 */
export async function callOpenAI(options: OpenAIRequestOptions): Promise<Response> {
  const config = await getApiConfig();

  if (!config.apiKey) {
    throw new Error('请先在扩展设置中配置 OpenAI API Key');
  }

  const response = await fetch(API_CONFIG.BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || API_CONFIG.DEFAULT_MODEL,
      messages: options.messages,
      temperature: options.temperature ?? API_CONFIG.DEFAULT_TEMPERATURE,
      max_tokens: options.maxTokens,
      stream: options.stream ?? false,
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    const errorData = await response.json() as { error?: { message?: string } };
    throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
  }

  return response;
}

/**
 * 调用 OpenAI API（非流式）
 */
export async function callOpenAISync(options: OpenAIRequestOptions): Promise<string> {
  const response = await callOpenAI({ ...options, stream: false });
  const data = await response.json() as OpenAIResponse;
  return data.choices[0]?.message?.content?.trim() || '';
}

