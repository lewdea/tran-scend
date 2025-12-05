// 按钮组 UI 组件

import { applyColorScheme } from '../../utils/colorScheme';
import { calculateButtonPosition } from '../../utils/position';
import { ELEMENT_IDS, CSS_CLASSES, TEXT } from '../constants';

export class ButtonGroup {
  private container: HTMLDivElement | null = null;

  create(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = ELEMENT_IDS.TRANSLATE_BUTTON;
    container.className = CSS_CLASSES.BUTTON_GROUP;
    container.style.display = 'none';
    applyColorScheme(container);

    // 左侧图标
    const icon = this.createIcon();
    container.appendChild(icon);

    // 按钮将在 show 方法中根据配置动态添加

    this.container = container;
    return container;
  }

  private createIcon(): HTMLDivElement {
    const icon = document.createElement('div');
    icon.className = CSS_CLASSES.ICON;

    const iconImg = document.createElement('img');
    iconImg.src = chrome.runtime.getURL('icons/icon32.png');
    iconImg.alt = 'Tran-scend';
    iconImg.style.width = '20px';
    iconImg.style.height = '20px';

    icon.appendChild(iconImg);
    return icon;
  }

  private createButtons(): HTMLButtonElement[] {
    const buttons: HTMLButtonElement[] = [];

    // Learn 按钮
    const learnBtn = this.createButton(TEXT.BUTTONS.LEARN);
    buttons.push(learnBtn);

    // Translate 按钮
    const translateBtn = this.createButton(TEXT.BUTTONS.TRANSLATE);
    buttons.push(translateBtn);

    // Check 按钮
    const checkBtn = this.createButton(TEXT.BUTTONS.CHECK);
    buttons.push(checkBtn);

    return buttons;
  }

  private createButton(text: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = CSS_CLASSES.BUTTON;
    button.textContent = text;
    return button;
  }

  show(
    selectionRect: DOMRect,
    onLearnClick: () => void,
    onTranslateClick: () => void,
    onCheckClick: () => void,
    settings: { learn: boolean; translate: boolean; check: boolean } = { learn: true, translate: true, check: true }
  ): void {
    if (!this.container) {
      this.container = this.create();
      document.body.appendChild(this.container);
    } else {
      // 更新颜色模式
      applyColorScheme(this.container);
    }

    // 清空现有按钮（保留图标）
    const icon = this.container.querySelector(`.${CSS_CLASSES.ICON}`);
    this.container.innerHTML = '';
    if (icon) {
      this.container.appendChild(icon);
    } else {
      this.container.appendChild(this.createIcon());
    }

    // 根据设置添加按钮
    if (settings.learn) {
      const learnBtn = this.createButton(TEXT.BUTTONS.LEARN);
      learnBtn.addEventListener('click', onLearnClick);
      this.container.appendChild(learnBtn);
    }

    if (settings.translate) {
      const translateBtn = this.createButton(TEXT.BUTTONS.TRANSLATE);
      translateBtn.addEventListener('click', onTranslateClick);
      this.container.appendChild(translateBtn);
    }

    if (settings.check) {
      const checkBtn = this.createButton(TEXT.BUTTONS.CHECK);
      checkBtn.addEventListener('click', onCheckClick);
      this.container.appendChild(checkBtn);
    }

    // 计算并设置位置
    const rect = selectionRect;

    // 临时显示以获取尺寸
    this.container.style.setProperty('display', 'flex');
    this.container.style.setProperty('visibility', 'hidden');
    this.container.style.setProperty('left', '-9999px');
    this.container.style.setProperty('top', '-9999px');

    const buttonRect = this.container.getBoundingClientRect();
    const { left, top } = calculateButtonPosition(rect, {
      width: buttonRect.width,
      height: buttonRect.height,
    });

    this.container.style.setProperty('left', `${left}px`);
    this.container.style.setProperty('top', `${top}px`);
    this.container.style.setProperty('visibility', 'visible');
  }

  hide(): void {
    if (this.container) {
      this.container.style.setProperty('display', 'none');
    }
  }

  getElement(): HTMLDivElement | null {
    return this.container;
  }
}

