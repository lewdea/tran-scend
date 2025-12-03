// 颜色模式检测和应用工具

import type { ColorScheme } from '../types';
import { REGEX, COLOR_THRESHOLD } from '../constants';

/**
 * 检测宿主页面的颜色模式
 */
export function detectColorScheme(): ColorScheme {
  // 方法1: 检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 方法2: 检查宿主页面的背景色
  const body = document.body;
  const html = document.documentElement;
  
  // 获取计算后的背景色
  const bodyStyle = window.getComputedStyle(body);
  const htmlStyle = window.getComputedStyle(html);
  
  const bodyBg = bodyStyle.backgroundColor;
  const htmlBg = htmlStyle.backgroundColor;
  
  // 检查是否是暗色背景
  const isDarkBg = (color: string): boolean => {
    // 解析 RGB 值
    const rgbMatch = color.match(REGEX.RGB_COLOR);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      // 计算亮度
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < COLOR_THRESHOLD.BRIGHTNESS_DARK;
    }
    return false;
  };
  
  // 检查 body 或 html 的背景色
  if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
    if (isDarkBg(bodyBg)) return 'dark';
  }
  
  if (htmlBg && htmlBg !== 'rgba(0, 0, 0, 0)' && htmlBg !== 'transparent') {
    if (isDarkBg(htmlBg)) return 'dark';
  }
  
  return 'light';
}

/**
 * 应用颜色模式到元素
 */
export function applyColorScheme(element: HTMLElement): void {
  const scheme = detectColorScheme();
  element.setAttribute('data-theme', scheme);
}

