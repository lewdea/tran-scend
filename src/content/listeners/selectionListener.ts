// 文本选择监听模块

import type { Selection } from '../../types';

export class SelectionListener {
  private onSelectionChange: (selection: Selection | null) => void;

  constructor(onSelectionChange: (selection: Selection | null) => void) {
    this.onSelectionChange = onSelectionChange;
    this.init();
  }

  private init(): void {
    document.addEventListener('mouseup', (e) => {
      // 延迟处理，确保选择已完成
      setTimeout(() => {
        const target = e.target as Element;

        // 如果点击的是按钮组或结果容器，不处理选择变化
        if (
          target.closest('#transcend-translate-btn') ||
          target.closest('#transcend-result')
        ) {
          return;
        }

        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || '';

        if (selectedText && selectedText.length > 0 && selection) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          const selectionData: Selection = {
            text: selectedText,
            x: rect.left,
            y: rect.top,
          };

          this.onSelectionChange(selectionData);
        } else {
          // 如果结果容器正在显示，不清除 currentSelection
          const resultContainer = document.getElementById('transcend-result');
          if (resultContainer && resultContainer.style.display !== 'none') {
            return;
          }
          this.onSelectionChange(null);
        }
      }, 10);
    });
  }

  shouldIgnoreEvent(target: EventTarget | null): boolean {
    if (!target) return false;
    const element = target as Element;
    return !!(
      element.closest('#transcend-translate-btn') ||
      element.closest('#transcend-result')
    );
  }
}

