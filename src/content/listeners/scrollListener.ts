// 滚动事件监听模块

export class ScrollListener {
  private onScroll: () => void;
  private scrollTimeout: NodeJS.Timeout | null = null;

  constructor(onScroll: () => void) {
    this.onScroll = onScroll;
    this.init();
  }

  private init(): void {
    document.addEventListener('scroll', () => {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      this.scrollTimeout = setTimeout(() => {
        this.onScroll();
      }, 100);
    }, true);
  }

  destroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

