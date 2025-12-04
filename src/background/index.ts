// Background Script 主入口文件

import type {
  TranslationRequest,
  TranslationResponse,
  LearnWordRequest,
  LearnPhraseRequest,
  TranslateRequest,
  CheckRequest,
} from '../types';
import { MESSAGE_ACTIONS } from './constants';
import { handleTranslation } from './handlers/translationHandler';
import { handleLearnWord } from './handlers/learnWordHandler';
import { handleLearnPhrase } from './handlers/learnPhraseHandler';
import { handleTranslate } from './handlers/translateHandler';
import { handleCheck } from './handlers/checkHandler';
import { sendMessageToTab } from './api/streaming';

// 消息监听器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 旧版翻译请求（保留兼容性）
  if (request.action === MESSAGE_ACTIONS.TRANSLATE && 'sourceLang' in request) {
    handleTranslation(request as TranslationRequest)
      .then((result) => sendResponse(result))
      .catch((error) =>
        sendResponse({
          success: false,
          error: error.message,
        } as TranslationResponse)
      );
    return true; // 保持消息通道开启
  }

  // 新版中文翻译请求（流式返回）
  if (request.action === MESSAGE_ACTIONS.TRANSLATE) {
    const tabId = sender.tab?.id;
    if (!tabId) {
      return false;
    }

    // 立即响应，表示消息已接收
    sendResponse({ success: true });
    
    // 异步处理流式响应
    handleTranslate(request as TranslateRequest, tabId).catch((error) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.TRANSLATE_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
    return true; // 保持消息通道开启
  }

  // 单词学习请求
  if (request.action === MESSAGE_ACTIONS.LEARN_WORD) {
    const tabId = sender.tab?.id;
    if (!tabId) {
      return false;
    }

    // 立即响应，表示消息已接收
    sendResponse({ success: true });
    
    // 异步处理流式响应
    handleLearnWord(request as LearnWordRequest, tabId).catch((error) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.LEARN_WORD_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
    return true; // 保持消息通道开启
  }

  // 短句学习请求
  if (request.action === MESSAGE_ACTIONS.LEARN_PHRASE) {
    const tabId = sender.tab?.id;
    if (!tabId) {
      return false;
    }

    // 立即响应，表示消息已接收
    sendResponse({ success: true });
    
    // 异步处理流式响应
    handleLearnPhrase(request as LearnPhraseRequest, tabId).catch((error) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.LEARN_WORD_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
    return true; // 保持消息通道开启
  }

  // 英文检查请求
  if (request.action === MESSAGE_ACTIONS.CHECK) {
    const tabId = sender.tab?.id;
    if (!tabId) {
      return false;
    }

    // 立即响应，表示消息已接收
    sendResponse({ success: true });
    
    // 异步处理流式响应
    handleCheck(request as CheckRequest, tabId).catch((error) => {
      sendMessageToTab(tabId, {
        action: MESSAGE_ACTIONS.CHECK_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
    return true; // 保持消息通道开启
  }

  return false;
});
