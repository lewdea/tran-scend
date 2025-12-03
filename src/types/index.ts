// 通用类型定义

export interface Selection {
  text: string;
  x: number;
  y: number;
}

export type ColorScheme = 'light' | 'dark';

// Background Script 消息类型
export interface TranslationRequest {
  action: 'translate';
  text: string;
  sourceLang: 'zh' | 'en';
  targetLang: 'zh' | 'en';
}

export interface TranslationResponse {
  success: boolean;
  translation?: string;
  error?: string;
}

export interface LearnWordRequest {
  action: 'learn-word';
  text: string;
}

export interface LearnPhraseRequest {
  action: 'learn-phrase';
  text: string;
}

export interface TranslateRequest {
  action: 'translate';
  text: string;
}

export interface CheckRequest {
  action: 'check';
  text: string;
}

// Content Script 消息类型
export interface LearnWordChunkMessage {
  action: 'learn-word-chunk';
  content: string;
}

export interface LearnWordDoneMessage {
  action: 'learn-word-done';
}

export interface LearnWordErrorMessage {
  action: 'learn-word-error';
  error: string;
}

export interface TranslateChunkMessage {
  action: 'translate-chunk';
  content: string;
}

export interface TranslateDoneMessage {
  action: 'translate-done';
}

export interface TranslateErrorMessage {
  action: 'translate-error';
  error: string;
}

export interface CheckChunkMessage {
  action: 'check-chunk';
  content: string;
}

export interface CheckDoneMessage {
  action: 'check-done';
}

export interface CheckErrorMessage {
  action: 'check-error';
  error: string;
}

export type ContentMessage = 
  | LearnWordChunkMessage 
  | LearnWordDoneMessage 
  | LearnWordErrorMessage
  | TranslateChunkMessage
  | TranslateDoneMessage
  | TranslateErrorMessage
  | CheckChunkMessage
  | CheckDoneMessage
  | CheckErrorMessage;

// API 配置类型
export interface ApiConfig {
  apiKey?: string;
  model?: string;
}

// OpenAI API 类型
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
}

