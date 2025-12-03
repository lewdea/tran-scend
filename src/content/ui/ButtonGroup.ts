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

    // 创建按钮
    const buttons = this.createButtons();
    buttons.forEach(btn => container.appendChild(btn));

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

  show(selectionRect: DOMRect, onLearnClick: () => void, onTranslateClick: () => void, onCheckClick: () => void): void {
    if (!this.container) {
      this.container = this.create();
      document.body.appendChild(this.container);
      
      // 设置按钮点击事件（只在创建时设置一次）
      const buttons = this.container.querySelectorAll(`.${CSS_CLASSES.BUTTON}`);
      if (buttons[0]) {
        buttons[0].addEventListener('click', () => {
          onLearnClick();
        });
      }
      if (buttons[1]) {
        buttons[1].addEventListener('click', () => {
          onTranslateClick();
        });
      }
      if (buttons[2]) {
        buttons[2].addEventListener('click', () => {
          onCheckClick();
        });
      }
    } else {
      // 更新颜色模式（可能已经变化）
      applyColorScheme(this.container);
    }

    // 计算并设置位置（使用传入的 selectionRect）
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

