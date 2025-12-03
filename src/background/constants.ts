// Background Script 本地常量

export const API_CONFIG = {
  BASE_URL: 'https://api.openai.com/v1/chat/completions',
  DEFAULT_MODEL: 'gpt-4o-mini',
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: {
    WORD: 2000,
    PHRASE: 2000,
    TRANSLATION: 2500,
    CHECK: 2500,
  },
} as const;

export const MESSAGE_ACTIONS = {
  TRANSLATE: 'translate',
  LEARN_WORD: 'learn-word',
  LEARN_PHRASE: 'learn-phrase',
  LEARN_WORD_CHUNK: 'learn-word-chunk',
  LEARN_WORD_DONE: 'learn-word-done',
  LEARN_WORD_ERROR: 'learn-word-error',
  TRANSLATE_CHUNK: 'translate-chunk',
  TRANSLATE_DONE: 'translate-done',
  TRANSLATE_ERROR: 'translate-error',
  CHECK: 'check',
  CHECK_CHUNK: 'check-chunk',
  CHECK_DONE: 'check-done',
  CHECK_ERROR: 'check-error',
} as const;

export const TEXT = {
  ERROR: {
    NO_API_KEY: '请先在扩展设置中配置 OpenAI API Key',
    API_FAILED: 'API 请求失败',
    UNKNOWN: 'Unknown error',
  },
} as const;
