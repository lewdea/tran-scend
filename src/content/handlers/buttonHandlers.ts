// 按钮处理模块

import { isSingleWord } from '../../utils/textUtils';
import type { Selection } from '../../types';

export class ButtonHandlers {
  private onLearnClick: (text: string, isWord: boolean) => void;
  private onTranslateClick: (text: string) => void;
  private onCheckClick: (text: string) => void;

  constructor(
    onLearnClick: (text: string, isWord: boolean) => void,
    onTranslateClick: (text: string) => void,
    onCheckClick: (text: string) => void
  ) {
    this.onLearnClick = onLearnClick;
    this.onTranslateClick = onTranslateClick;
    this.onCheckClick = onCheckClick;
  }

  handleLearn(selection: Selection | null): void {
    if (!selection || !selection.text) {
      return;
    }

    const selectedText = selection.text.trim();
    if (!selectedText) {
      return;
    }

    const isWord = isSingleWord(selectedText);
    this.onLearnClick(selectedText, isWord);
  }

  handleTranslate(selection: Selection | null): void {
    if (!selection || !selection.text) {
      return;
    }

    const selectedText = selection.text.trim();
    if (!selectedText) {
      return;
    }

    this.onTranslateClick(selectedText);
  }

  handleCheck(selection: Selection | null): void {
    if (!selection || !selection.text) {
      return;
    }

    const selectedText = selection.text.trim();
    if (!selectedText) {
      return;
    }

    this.onCheckClick(selectedText);
  }
}

