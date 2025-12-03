// 点击事件监听模块

export class ClickListener {
  private onOutsideClick: () => void;

  constructor(onOutsideClick: () => void) {
    this.onOutsideClick = onOutsideClick;
    this.init();
  }

  private init(): void {
    document.addEventListener('mousedown', (e) => {
      const target = e.target as Element;
      
      // 如果点击的是按钮组或结果容器，不处理
      if (
        target.closest('#transcend-translate-btn') ||
        target.closest('#transcend-result')
      ) {
        return;
      }

      this.onOutsideClick();
    });
  }
}

