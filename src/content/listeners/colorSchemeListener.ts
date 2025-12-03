// 颜色模式变化监听模块

import { applyColorScheme } from '../../utils/colorScheme';

export class ColorSchemeListener {
  private elements: HTMLElement[] = [];

  constructor() {
    this.init();
  }

  register(element: HTMLElement): void {
    this.elements.push(element);
    applyColorScheme(element);
  }

  unregister(element: HTMLElement): void {
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
  }

  private init(): void {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', () => {
        // 更新所有已注册的元素
        this.elements.forEach(element => {
          applyColorScheme(element);
        });
      });
    }
  }
}

