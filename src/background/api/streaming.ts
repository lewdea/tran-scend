// 流式响应处理模块

import type { ContentMessage } from '../../types';
import { MESSAGE_ACTIONS } from '../constants';

export interface StreamChunkHandler {
  onChunk: (content: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

/**
 * 处理 OpenAI 流式响应
 */
export async function processStreamResponse(
  response: Response,
  _tabId: number,
  handlers: StreamChunkHandler
): Promise<void> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  if (!reader) {
    handlers.onError('无法读取响应流');
    return;
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        handlers.onDone();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            handlers.onDone();
            return;
          }

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              handlers.onChunk(content);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    handlers.onError(errorMessage);
  }
}

/**
 * 发送消息到 content script
 */
export function sendMessageToTab(tabId: number, message: ContentMessage): void {
  chrome.tabs.sendMessage(tabId, message).catch(() => {
    // 忽略发送错误（可能是页面已关闭）
  });
}

/**
 * 创建流式处理器的默认实现（发送到 content script）
 */
export function createStreamHandlers(tabId: number): StreamChunkHandler {
  return {
    onChunk: (content: string) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.LEARN_WORD_CHUNK,
        content,
      });
    },
    onDone: () => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.LEARN_WORD_DONE,
      });
    },
    onError: (error: string) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.LEARN_WORD_ERROR,
        error,
      });
    },
  };
}

/**
 * 创建翻译流式处理器（发送到 content script）
 */
export function createTranslateHandlers(tabId: number): StreamChunkHandler {
  return {
    onChunk: (content: string) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.TRANSLATE_CHUNK,
        content,
      });
    },
    onDone: () => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.TRANSLATE_DONE,
      });
    },
    onError: (error: string) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.TRANSLATE_ERROR,
        error,
      });
    },
  };
}

/**
 * 创建检查流式处理器（发送到 content script）
 */
export function createCheckHandlers(tabId: number): StreamChunkHandler {
  return {
    onChunk: (content: string) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.CHECK_CHUNK,
        content,
      });
    },
    onDone: () => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.CHECK_DONE,
      });
    },
    onError: (error: string) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.CHECK_ERROR,
        error,
      });
    },
  };
}

