// 应用常量定义

// DOM 元素 ID
export const ELEMENT_IDS = {
  TRANSLATE_BUTTON: 'transcend-translate-btn',
  RESULT_CONTAINER: 'transcend-result',
  COPY_BUTTON: 'transcend-copy-btn',
  CLOSE_BUTTON: 'transcend-close-btn',
} as const;

// CSS 类名
export const CSS_CLASSES = {
  BUTTON_GROUP: 'transcend-button-group',
  ICON: 'transcend-icon',
  BUTTON: 'transcend-btn',
  RESULT_HEADER: 'transcend-result-header',
  RESULT_CONTENT: 'transcend-result-content',
  RESULT_ACTIONS: 'transcend-result-actions',
  COPY_BUTTON: 'transcend-copy-btn',
  CLOSE_BUTTON: 'transcend-close-btn',
  RESULT_LOADING: 'transcend-result-loading',
  RESULT_ERROR: 'transcend-result-error',
} as const;

// 消息 Action 类型
export const MESSAGE_ACTIONS = {
  TRANSLATE: 'translate',
  LEARN_WORD: 'learn-word',
  LEARN_PHRASE: 'learn-phrase',
  LEARN_WORD_CHUNK: 'learn-word-chunk',
  LEARN_WORD_DONE: 'learn-word-done',
  LEARN_WORD_ERROR: 'learn-word-error',
} as const;

// API 配置
export const API_CONFIG = {
  BASE_URL: 'https://api.openai.com/v1/chat/completions',
  DEFAULT_MODEL: 'gpt-4o-mini',
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: {
    WORD: 2000,
    PHRASE: 2000,
    TRANSLATION: 1000,
  },
} as const;

// UI 配置
export const UI_CONFIG = {
  BUTTON_OFFSET: {
    TOP: 8,
    BOTTOM: 8,
    LEFT: 10,
    RIGHT: 10,
  },
  RESULT_OFFSET: {
    TOP: 60,
    BOTTOM: 8,
    LEFT: 10,
    RIGHT: 10,
  },
  RESULT_SIZE: {
    MAX_WIDTH: 500,
    MIN_WIDTH: 320,
  },
  ANIMATION: {
    TRANSITION_DURATION: 150,
    COPY_FEEDBACK_DURATION: 1500,
  },
} as const;

// 颜色主题
export const THEME_COLORS = {
  PRIMARY: 'rgb(77, 163, 236)',
  SECONDARY: 'rgb(92, 195, 202)',
  ERROR: '#e74c3c',
  TEXT: {
    LIGHT: '#2c3e50',
    DARK: '#e0e0e0',
  },
  BACKGROUND: {
    LIGHT: '#ffffff',
    DARK: '#1e1e1e',
  },
} as const;

// 文本内容
export const TEXT = {
  BUTTONS: {
    LEARN: 'Learn',
    TRANSLATE: 'Translate',
    CHECK: 'Check',
  },
  HEADER: {
    LEARN: 'Learn',
    RESULT: '结果',
  },
  ACTIONS: {
    COPY: '复制',
    COPIED: '✓ 已复制',
    CLOSE: '✕',
  },
  LOADING: {
    WORD: '正在分析单词...',
    PHRASE: '正在翻译和讲解...',
  },
  ERROR: {
    NO_API_KEY: '请先在扩展设置中配置 OpenAI API Key',
    API_FAILED: 'API 请求失败',
    UNKNOWN: 'Unknown error',
  },
} as const;

// 正则表达式
export const REGEX = {
  SINGLE_WORD: /^[a-zA-Z0-9\-']+$/,
  RGB_COLOR: /rgba?\((\d+),\s*(\d+),\s*(\d+)/,
} as const;

// 颜色检测阈值
export const COLOR_THRESHOLD = {
  BRIGHTNESS_DARK: 128,
} as const;

