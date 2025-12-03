// 翻译 Prompt 构建模块

/**
 * 构建翻译 prompt
 */
export function buildTranslationPrompt(text: string, sourceLang: 'zh' | 'en', targetLang: 'zh' | 'en'): string {
  const langMap: Record<'zh' | 'en', string> = {
    'zh': '中文',
    'en': 'English',
  };

  const sourceLanguage = langMap[sourceLang];
  const targetLanguage = langMap[targetLang];

  return `Please translate the following ${sourceLanguage} text to ${targetLanguage}. Only provide the translation without any explanations or additional text.

Text to translate:
${text}`;
}

