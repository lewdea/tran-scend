// Content Script 主入口文件
import './index.css';

// 导入类型
import type { Selection, ContentMessage } from '../types';

// 导入常量
import { MESSAGE_ACTIONS, TEXT, CSS_CLASSES } from './constants';

// 导入 UI 组件
import { ButtonGroup } from './ui/ButtonGroup';
import { ResultContainer } from './ui/ResultContainer';

// 导入处理器
import { MessageHandler } from './handlers/messageHandler';
import { ButtonHandlers } from './handlers/buttonHandlers';

// 导入监听器
import { SelectionListener } from './listeners/selectionListener';
import { ColorSchemeListener } from './listeners/colorSchemeListener';
import { ClickListener } from './listeners/clickListener';
import { ScrollListener } from './listeners/scrollListener';

// 应用状态
class ContentApp {
  private buttonGroup: ButtonGroup;
  private resultContainer: ResultContainer;
  private messageHandler: MessageHandler;
  private buttonHandlers: ButtonHandlers;
  private colorSchemeListener: ColorSchemeListener;
  private currentSelection: Selection | null = null;
  private isEnabled: boolean = true; // 是否启用按钮组

  constructor() {
    // 初始化组件
    this.buttonGroup = new ButtonGroup();
    this.resultContainer = new ResultContainer();
    this.messageHandler = new MessageHandler(this.resultContainer);
    this.colorSchemeListener = new ColorSchemeListener();

    // 检查当前域名是否在黑名单中
    this.checkDomainBlocklist();

    // 监听存储变化，实时更新黑名单状态
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.blockedDomains) {
        this.checkDomainBlocklist();
      }
    });

    // 初始化监听器（它们在构造函数中会自动开始工作）
    new ClickListener(() => this.hideButtonGroup());
    new ScrollListener(() => this.hideButtonGroup());
    new SelectionListener((selection) => {
      this.handleSelectionChange(selection);
    });

    // 初始化按钮处理器
    this.buttonHandlers = new ButtonHandlers(
      (text, isWord) => this.handleLearn(text, isWord),
      (text) => this.handleTranslate(text),
      (text) => this.handleCheck(text)
    );

    // 注册颜色模式监听
    const buttonElement = this.buttonGroup.getElement();
    const resultElement = this.resultContainer.getElement();
    if (buttonElement) this.colorSchemeListener.register(buttonElement);
    if (resultElement) this.colorSchemeListener.register(resultElement);

    // 初始化消息监听
    this.initMessageListener();
  }

  private handleSelectionChange(selection: Selection | null): void {
    this.currentSelection = selection;
    this.messageHandler.setCurrentSelection(selection);

    // 如果域名被禁用，不显示按钮组
    if (!this.isEnabled) {
      return;
    }

    if (selection) {
      this.showButtonGroup(selection);
    } else {
      this.hideButtonGroup();
    }
  }

  /**
   * 检查当前域名是否在黑名单中
   */
  private async checkDomainBlocklist(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['blockedDomains']);
      const blockedDomains: string[] = result.blockedDomains || [];

      if (blockedDomains.length === 0) {
        this.isEnabled = true;
        return;
      }

      // 获取当前域名（去除 www 前缀）
      const currentDomain = window.location.hostname.replace(/^www\./, '').toLowerCase();

      // 检查是否在黑名单中
      this.isEnabled = !blockedDomains.includes(currentDomain);
    } catch {
      // 如果检查失败，默认启用
      this.isEnabled = true;
    }
  }

  private showButtonGroup(_selection: Selection): void {
    // 获取选中文本的 DOMRect（使用 window.getSelection 获取最新的选择状态）
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) return;
    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    this.buttonGroup.show(
      rect,
      () => this.buttonHandlers.handleLearn(this.currentSelection),
      () => this.buttonHandlers.handleTranslate(this.currentSelection),
      () => this.buttonHandlers.handleCheck(this.currentSelection)
    );
  }

  private hideButtonGroup(): void {
    this.buttonGroup.hide();
  }

  private handleLearn(text: string, isWord: boolean): void {
    // 隐藏按钮组
    this.hideButtonGroup();

    // 关闭之前的结果弹窗
    this.resultContainer.hide();
    this.resultContainer.reset();

    // 保存当前单词（如果是单词学习）
    if (isWord) {
      this.messageHandler.setCurrentWord(text);
    }

    // 显示加载状态
    const loadingText = isWord ? TEXT.LOADING.WORD : TEXT.LOADING.PHRASE;
    const loadingHTML = `<div class="${CSS_CLASSES.RESULT_LOADING}">${loadingText}</div>`;

    if (this.currentSelection) {
      const word = isWord ? text : undefined;
      this.resultContainer.show(loadingHTML, this.currentSelection, TEXT.HEADER.LEARN, word);
    }

    // 发送请求
    const action = isWord ? MESSAGE_ACTIONS.LEARN_WORD : MESSAGE_ACTIONS.LEARN_PHRASE;
    chrome.runtime.sendMessage(
      {
        action,
        text,
      },
      () => {
        if (chrome.runtime.lastError) {
          if (this.currentSelection) {
            const errorHTML = `<div class="${CSS_CLASSES.RESULT_ERROR}">❌ ${TEXT.ERROR.API_FAILED}: ${chrome.runtime.lastError.message}</div>`;
            this.resultContainer.show(errorHTML, this.currentSelection, TEXT.HEADER.LEARN);
          }
        }
      }
    );
  }

  private handleTranslate(text: string): void {
    // 隐藏按钮组
    this.hideButtonGroup();

    // 关闭之前的结果弹窗
    this.resultContainer.hide();
    this.resultContainer.reset();

    // 显示加载状态
    const loadingHTML = `<div class="${CSS_CLASSES.RESULT_LOADING}">${TEXT.LOADING.TRANSLATE}</div>`;

    if (this.currentSelection) {
      this.resultContainer.show(loadingHTML, this.currentSelection, TEXT.HEADER.TRANSLATE);
    }

    // 发送请求
    chrome.runtime.sendMessage(
      {
        action: MESSAGE_ACTIONS.TRANSLATE,
        text,
      },
      () => {
        if (chrome.runtime.lastError) {
          if (this.currentSelection) {
            const errorHTML = `<div class="${CSS_CLASSES.RESULT_ERROR}">❌ ${TEXT.ERROR.API_FAILED}: ${chrome.runtime.lastError.message}</div>`;
            this.resultContainer.show(errorHTML, this.currentSelection, TEXT.HEADER.TRANSLATE);
          }
        }
      }
    );
  }

  private handleCheck(text: string): void {
    // 隐藏按钮组
    this.hideButtonGroup();

    // 关闭之前的结果弹窗
    this.resultContainer.hide();
    this.resultContainer.reset();

    // 显示加载状态
    const loadingHTML = `<div class="${CSS_CLASSES.RESULT_LOADING}">${TEXT.LOADING.CHECK}</div>`;

    if (this.currentSelection) {
      this.resultContainer.show(loadingHTML, this.currentSelection, TEXT.HEADER.CHECK);
    }

    // 发送请求
    chrome.runtime.sendMessage(
      {
        action: MESSAGE_ACTIONS.CHECK,
        text,
      },
      () => {
        if (chrome.runtime.lastError) {
          if (this.currentSelection) {
            const errorHTML = `<div class="${CSS_CLASSES.RESULT_ERROR}">❌ ${TEXT.ERROR.API_FAILED}: ${chrome.runtime.lastError.message}</div>`;
            this.resultContainer.show(errorHTML, this.currentSelection, TEXT.HEADER.CHECK);
          }
        }
      }
    );
  }

  private initMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: ContentMessage) => {
      this.messageHandler.handle(message);
    });
  }
}

// 初始化应用（保留引用以确保监听器持续工作）
void new ContentApp();
