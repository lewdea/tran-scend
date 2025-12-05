// 结果容器 UI 组件

import { applyColorScheme } from '../../utils/colorScheme';
import { calculateResultPosition } from '../../utils/position';
import { speakText } from '../../utils/speech';
import { ELEMENT_IDS, CSS_CLASSES, TEXT } from '../constants';
import type { Selection } from '../../types';

export class ResultContainer {
  private container: HTMLDivElement | null = null;
  private accumulatedContent: string = '';
  private currentWord: string = ''; // 当前学习的单词
  private phoneticButtonsAdded: boolean = false; // 是否已添加音标按钮
  private onStop: () => void;

  constructor(onStop?: () => void) {
    this.onStop = onStop || (() => { });
  }

  create(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = ELEMENT_IDS.RESULT_CONTAINER;
    applyColorScheme(container);
    this.container = container;
    return container;
  }

  show(text: string, selection: Selection, headerText: string = TEXT.HEADER.RESULT, word?: string): void {
    if (!this.container) {
      this.container = this.create();
      document.body.appendChild(this.container);
    } else {
      applyColorScheme(this.container);
    }

    // 保存单词（如果是 Learn 功能）
    if (word) {
      this.currentWord = word;
    }

    // 构建 HTML
    const finalHTML = this.buildHTML(text, headerText);
    this.container.innerHTML = finalHTML;

    // 添加事件监听
    this.attachEventListeners();

    // 添加音标播放按钮（只在非流式显示时）
    if (word) {
      const contentDiv = this.container.querySelector(`.${CSS_CLASSES.RESULT_CONTENT}`) as HTMLDivElement;
      if (contentDiv) {
        // 在内容中插入按钮
        const contentWithButtons = this.insertPhoneticButtons(text, word);
        if (contentWithButtons !== text) {
          contentDiv.innerHTML = contentWithButtons;
          this.phoneticButtonsAdded = true;
          setTimeout(() => {
            this.attachPhoneticButtonListeners(contentDiv);
          }, 0);
        }
      }
    }

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

    // 显示停止按钮
    const stopBtn = document.getElementById(ELEMENT_IDS.STOP_BUTTON);
    if (stopBtn) {
      stopBtn.style.display = 'inline-block';
    }
  }

  appendChunk(content: string, selection: Selection | null, word?: string): void {
    this.accumulatedContent += content;

    // 保存单词（如果是第一次）
    if (word && !this.currentWord) {
      this.currentWord = word;
    }

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

  /**
   * 流式内容完成后，添加音标播放按钮
   */
  finishStreaming(): void {
    if (!this.currentWord || this.phoneticButtonsAdded) {
      return;
    }

    const contentDiv = this.container?.querySelector(`.${CSS_CLASSES.RESULT_CONTENT}`) as HTMLDivElement;
    if (!contentDiv) {
      return;
    }

    // 检查是否包含音标
    const hasPhonetic = this.accumulatedContent.includes('美式') || this.accumulatedContent.includes('英式');
    if (!hasPhonetic) {
      return;
    }

    // 在内容中插入按钮
    const contentWithButtons = this.insertPhoneticButtons(this.accumulatedContent, this.currentWord);
    if (contentWithButtons !== this.accumulatedContent) {
      this.accumulatedContent = contentWithButtons;
      contentDiv.innerHTML = this.accumulatedContent;
      this.phoneticButtonsAdded = true;

      // 添加事件监听
      setTimeout(() => {
        this.attachPhoneticButtonListeners(contentDiv);
      }, 0);
    }

    // 隐藏停止按钮
    const stopBtn = document.getElementById(ELEMENT_IDS.STOP_BUTTON);
    if (stopBtn) {
      stopBtn.style.display = 'none';
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
    this.currentWord = '';
    this.phoneticButtonsAdded = false;
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
          <span class="${CSS_CLASSES.STOP_BUTTON}" id="${ELEMENT_IDS.STOP_BUTTON}" style="display: none;">${TEXT.ACTIONS.STOP}</span>
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
          this.onStop();
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

      // 停止按钮
      const stopBtn = document.getElementById(ELEMENT_IDS.STOP_BUTTON);
      if (stopBtn && !stopBtn.hasAttribute('data-listener')) {
        stopBtn.setAttribute('data-listener', 'true');
        stopBtn.addEventListener('click', () => {
          this.onStop();
          stopBtn.style.display = 'none';
        });
      }
    }, 0);
  }

  getElement(): HTMLDivElement | null {
    return this.container;
  }

  /**
   * 在内容字符串中插入音标播放按钮
   */
  private insertPhoneticButtons(content: string, word: string): string {
    if (!word || content.includes('transcend-phonetic-btn')) {
      return content;
    }

    let result = content;

    // 处理美式音标
    // 格式1: 美式：<code>音标</code>
    if (result.includes('美式') && result.match(/美式[：:]\s*<code[^>]*>([^<]+)<\/code>/)) {
      result = result.replace(
        /美式[：:]\s*<code[^>]*>([^<]+)<\/code>/,
        `美式：<code class="transcend-phonetic">$1</code> <button class="transcend-phonetic-btn" data-word="${word}" data-lang="en-US" title="Play US pronunciation">🔊</button>`
      );
    }
    // 格式2: 美式：[音标]
    else if (result.includes('美式') && result.match(/美式[：:]\s*\[([^\]]+)\]/)) {
      result = result.replace(
        /美式[：:]\s*\[([^\]]+)\]/,
        `美式：<code class="transcend-phonetic">$1</code> <button class="transcend-phonetic-btn" data-word="${word}" data-lang="en-US" title="Play US pronunciation">🔊</button>`
      );
    }

    // 处理英式音标
    // 格式1: 英式：<code>音标</code>
    if (result.includes('英式') && result.match(/英式[：:]\s*<code[^>]*>([^<]+)<\/code>/)) {
      result = result.replace(
        /英式[：:]\s*<code[^>]*>([^<]+)<\/code>/,
        `英式：<code class="transcend-phonetic">$1</code> <button class="transcend-phonetic-btn" data-word="${word}" data-lang="en-GB" title="Play UK pronunciation">🔊</button>`
      );
    }
    // 格式2: 英式：[音标]
    else if (result.includes('英式') && result.match(/英式[：:]\s*\[([^\]]+)\]/)) {
      result = result.replace(
        /英式[：:]\s*\[([^\]]+)\]/,
        `英式：<code class="transcend-phonetic">$1</code> <button class="transcend-phonetic-btn" data-word="${word}" data-lang="en-GB" title="Play UK pronunciation">🔊</button>`
      );
    }

    return result;
  }

  /**
   * 为音标播放按钮添加事件监听
   */
  private attachPhoneticButtonListeners(contentDiv: HTMLDivElement): void {
    const buttons = contentDiv.querySelectorAll('.transcend-phonetic-btn');
    buttons.forEach((btn) => {
      if (!btn.hasAttribute('data-listener')) {
        btn.setAttribute('data-listener', 'true');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const word = (btn as HTMLElement).getAttribute('data-word');
          const lang = (btn as HTMLElement).getAttribute('data-lang') as 'en-US' | 'en-GB';
          if (word) {
            speakText(word, lang);
          }
        });
      }
    });
  }
}

