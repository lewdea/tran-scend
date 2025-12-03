// 翻译处理模块

import type { TranslationRequest, TranslationResponse } from '../../types';
import { callOpenAISync } from '../api/openai';
import { buildTranslationPrompt } from '../prompts/translationPrompt';

/**
 * 处理翻译请求
 */
export async function handleTranslation(
  request: TranslationRequest
): Promise<TranslationResponse> {
  try {
    const prompt = buildTranslationPrompt(
      request.text,
      request.sourceLang,
      request.targetLang
    );

    const translation = await callOpenAISync({
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specializing in Chinese and English translation. Provide accurate, natural, and contextually appropriate translations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      maxTokens: 1000,
    });

    return {
      success: true,
      translation,
    };
  } catch (error) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

