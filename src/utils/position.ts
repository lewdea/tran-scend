// 位置计算工具函数

import { UI_CONFIG } from '../constants';

interface Position {
  left: number;
  top: number;
}

interface Bounds {
  width: number;
  height: number;
}

/**
 * 计算按钮位置，确保不超出视口
 */
export function calculateButtonPosition(
  rect: DOMRect,
  buttonBounds: Bounds
): Position {
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  // 按钮右边对齐到选中文本的右边界
  let left = rect.right + scrollX - buttonBounds.width;
  // 按钮显示在选中文本的下方
  let top = rect.bottom + scrollY + UI_CONFIG.BUTTON_OFFSET.TOP;

  // 确保按钮不超出右边界
  if (left + buttonBounds.width > window.innerWidth + scrollX) {
    left = window.innerWidth + scrollX - buttonBounds.width - UI_CONFIG.BUTTON_OFFSET.RIGHT;
  }

  // 确保按钮不超出下边界
  if (top + buttonBounds.height > window.innerHeight + scrollY) {
    top = rect.top + scrollY - buttonBounds.height - UI_CONFIG.BUTTON_OFFSET.BOTTOM;
  }

  return { left, top };
}

/**
 * 计算结果容器位置，确保不超出视口
 */
export function calculateResultPosition(
  x: number,
  y: number,
  containerBounds: Bounds
): Position {
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  let left = x + scrollX;
  let top = y + scrollY + UI_CONFIG.RESULT_OFFSET.TOP;

  // 确保不超出右边界
  if (left + containerBounds.width > window.innerWidth + scrollX) {
    left = window.innerWidth + scrollX - containerBounds.width - UI_CONFIG.RESULT_OFFSET.RIGHT;
  }

  // 确保不超出下边界
  if (top + containerBounds.height > window.innerHeight + scrollY) {
    top = y + scrollY - containerBounds.height - UI_CONFIG.RESULT_OFFSET.BOTTOM;
  }

  return { left, top };
}

