// Content Script 本地常量

export const ELEMENT_IDS = {
  TRANSLATE_BUTTON: 'transcend-translate-btn',
  RESULT_CONTAINER: 'transcend-result',
  COPY_BUTTON: 'transcend-copy-btn',
  CLOSE_BUTTON: 'transcend-close-btn',
  STOP_BUTTON: 'transcend-stop-btn',
} as const;

export const CSS_CLASSES = {
  BUTTON_GROUP: 'transcend-button-group',
  ICON: 'transcend-icon',
  BUTTON: 'transcend-btn',
  RESULT_HEADER: 'transcend-result-header',
  RESULT_CONTENT: 'transcend-result-content',
  RESULT_ACTIONS: 'transcend-result-actions',
  COPY_BUTTON: 'transcend-copy-btn',
  CLOSE_BUTTON: 'transcend-close-btn',
  STOP_BUTTON: 'transcend-stop-btn',
  RESULT_LOADING: 'transcend-result-loading',
  RESULT_ERROR: 'transcend-result-error',
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
  STOP_STREAMING: 'stop-streaming',
} as const;

export const TEXT = {
  BUTTONS: {
    LEARN: 'Learn',
    TRANSLATE: 'Translate',
    CHECK: 'Check',
  },
  HEADER: {
    LEARN: 'Learn',
    TRANSLATE: 'Translate',
    CHECK: 'Check',
    RESULT: '结果',
  },
  LOADING: {
    WORD: '正在分析单词...',
    PHRASE: '正在翻译和讲解...',
    TRANSLATE: '正在翻译...',
    CHECK: '正在检查...',
  },
  ACTIONS: {
    COPY: '复制',
    COPIED: '✓ 已复制',
    STOP: '停止',
  },
  ERROR: {
    API_FAILED: 'API 请求失败',
  },
} as const;

export const REGEX = {
  SINGLE_WORD: /^[a-zA-Z0-9\-']+$/,
  RGB_COLOR: /rgba?\((\d+),\s*(\d+),\s*(\d+)/,
} as const;

export const COLOR_THRESHOLD = {
  BRIGHTNESS_DARK: 128,
} as const;

export const UI_CONFIG = {
  BUTTON_OFFSET: {
    TOP: 8,
    BOTTOM: 8,
    RIGHT: 10,
  },
  RESULT_OFFSET: {
    TOP: 60,
    BOTTOM: 8,
    RIGHT: 10,
  },
} as const;
