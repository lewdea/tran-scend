// 结果容器 UI 组件

import { applyColorScheme } from '../../utils/colorScheme';
import { calculateResultPosition } from '../../utils/position';
import { ELEMENT_IDS, CSS_CLASSES, TEXT } from '../constants';
import type { Selection } from '../../types';

export class ResultContainer {
  private container: HTMLDivElement | null = null;
  private accumulatedContent: string = '';

  create(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = ELEMENT_IDS.RESULT_CONTAINER;
    applyColorScheme(container);
    this.container = container;
    return container;
  }

  show(text: string, selection: Selection, headerText: string = TEXT.HEADER.RESULT): void {
    if (!this.container) {
      this.container = this.create();
      document.body.appendChild(this.container);
    } else {
      applyColorScheme(this.container);
    }

    // 构建 HTML
    const finalHTML = this.buildHTML(text, headerText);
    this.container.innerHTML = finalHTML;

    // 添加事件监听
    this.attachEventListeners();

    // 计算并设置位置
    this.container.style.setProperty('display', 'block');
    this.container.style.setProperty('visibility', 'hidden');
    this.container.style.setProperty('left', '-9999px');
    this.container.style.setProperty('top', '-9999px');

    const containerRect = this.container.getBoundingClientRect();
    const { left, top } = calculateResultPosition(selection.x, selection.y, {
      width: containerRect.width,
      height: containerRect.height,
    });

    this.container.style.setProperty('left', `${left}px`);
    this.container.style.setProperty('top', `${top}px`);
    this.container.style.setProperty('visibility', 'visible');
  }

  appendChunk(content: string, selection: Selection | null): void {
    this.accumulatedContent += content;

    if (!this.container) {
      this.container = this.create();
      document.body.appendChild(this.container);
    }

    let contentDiv = this.container.querySelector(`.${CSS_CLASSES.RESULT_CONTENT}`) as HTMLDivElement;
    if (!contentDiv) {
      // 初始化结果容器
      const resultHTML = this.buildHTML('', TEXT.HEADER.LEARN);
      this.container.innerHTML = resultHTML;
      this.attachEventListeners();
      contentDiv = this.container.querySelector(`.${CSS_CLASSES.RESULT_CONTENT}`) as HTMLDivElement;

      // 设置位置
      if (selection) {
        this.container.style.setProperty('display', 'block');
        this.container.style.setProperty('visibility', 'hidden');
        this.container.style.setProperty('left', '-9999px');
        this.container.style.setProperty('top', '-9999px');

        const containerRect = this.container.getBoundingClientRect();
        const { left, top } = calculateResultPosition(selection.x, selection.y, {
          width: containerRect.width,
          height: containerRect.height,
        });

        this.container.style.setProperty('left', `${left}px`);
        this.container.style.setProperty('top', `${top}px`);
        this.container.style.setProperty('visibility', 'visible');
      }
    }

    if (contentDiv) {
      contentDiv.innerHTML = this.accumulatedContent;
      contentDiv.scrollTop = contentDiv.scrollHeight;
    }
  }

  hide(): void {
    if (this.container) {
      this.container.style.setProperty('display', 'none');
    }
    this.accumulatedContent = '';
  }

  reset(): void {
    this.accumulatedContent = '';
  }

  private buildHTML(text: string, headerText: string): string {
    if (text.includes('transcend-result-header')) {
      return text;
    }

    const iconUrl = chrome.runtime.getURL('icons/icon32.png');
    return `
      <div class="${CSS_CLASSES.RESULT_HEADER}">
        <div class="transcend-result-header-left">
          <img src="${iconUrl}" alt="Tran-scend" class="transcend-result-icon" />
          <span>${headerText}</span>
        </div>
        <div class="${CSS_CLASSES.RESULT_ACTIONS}">
          <span class="${CSS_CLASSES.COPY_BUTTON}" id="${ELEMENT_IDS.COPY_BUTTON}">${TEXT.ACTIONS.COPY}</span>
          <span class="${CSS_CLASSES.CLOSE_BUTTON}" id="${ELEMENT_IDS.CLOSE_BUTTON}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="${CSS_CLASSES.RESULT_CONTENT}">${text}</div>
    `;
  }

  private attachEventListeners(): void {
    setTimeout(() => {
      // 关闭按钮
      const closeBtn = document.getElementById(ELEMENT_IDS.CLOSE_BUTTON);
      if (closeBtn && !closeBtn.hasAttribute('data-listener')) {
        closeBtn.setAttribute('data-listener', 'true');
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.hide();
        });
      }

      // 复制按钮
      const copyBtn = document.getElementById(ELEMENT_IDS.COPY_BUTTON);
      if (copyBtn && !copyBtn.hasAttribute('data-listener')) {
        copyBtn.setAttribute('data-listener', 'true');
        copyBtn.addEventListener('click', () => {
          if (this.container) {
            const content = this.container.querySelector(`.${CSS_CLASSES.RESULT_CONTENT}`);
            if (content) {
              navigator.clipboard.writeText(content.textContent || '');
              copyBtn.textContent = TEXT.ACTIONS.COPIED;
              setTimeout(() => {
                copyBtn.textContent = TEXT.ACTIONS.COPY;
              }, 1500);
            }
          }
        });
      }
    }, 0);
  }

  getElement(): HTMLDivElement | null {
    return this.container;
  }
}

