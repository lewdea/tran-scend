// 消息处理模块

import type { ContentMessage } from '../../types';
import { MESSAGE_ACTIONS } from '../constants';
import { ResultContainer } from '../ui/ResultContainer';
import type { Selection } from '../../types';

export class MessageHandler {
  private resultContainer: ResultContainer;
  private currentSelection: Selection | null = null;
  private currentWord: string = ''; // 当前学习的单词

  constructor(resultContainer: ResultContainer) {
    this.resultContainer = resultContainer;
  }

  setCurrentSelection(selection: Selection | null): void {
    this.currentSelection = selection;
  }

  setCurrentWord(word: string): void {
    this.currentWord = word;
  }

  handle(message: ContentMessage): void {
    switch (message.action) {
      case MESSAGE_ACTIONS.LEARN_WORD_CHUNK:
        this.handleChunk(message.content);
        break;
      case MESSAGE_ACTIONS.LEARN_WORD_DONE:
        this.handleDone();
        break;
      case MESSAGE_ACTIONS.LEARN_WORD_ERROR:
        this.handleError(message.error, 'Learn');
        break;
      case MESSAGE_ACTIONS.TRANSLATE_CHUNK:
        this.handleChunk(message.content);
        break;
      case MESSAGE_ACTIONS.TRANSLATE_DONE:
        this.handleDone();
        break;
      case MESSAGE_ACTIONS.TRANSLATE_ERROR:
        this.handleError(message.error, 'Translate');
        break;
      case MESSAGE_ACTIONS.CHECK_CHUNK:
        this.handleChunk(message.content);
        break;
      case MESSAGE_ACTIONS.CHECK_DONE:
        this.handleDone();
        break;
      case MESSAGE_ACTIONS.CHECK_ERROR:
        this.handleError(message.error, 'Check');
        break;
    }
  }

  private handleChunk(content: string): void {
    if (this.currentSelection) {
      this.resultContainer.appendChunk(content, this.currentSelection, this.currentWord);
    }
  }

  private handleDone(): void {
    console.log('Stream completed');
    // 流式内容完成后，添加音标播放按钮
    this.resultContainer.finishStreaming();
  }

  private handleError(error: string, headerText: string = 'Learn'): void {
    if (this.currentSelection) {
      const errorHTML = `<div class="transcend-result-error">❌ ${error}</div>`;
      this.resultContainer.show(errorHTML, this.currentSelection, headerText);
    }
  }
}

