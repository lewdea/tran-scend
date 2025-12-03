// 文本处理工具函数

import { REGEX } from '../constants';

/**
 * 判断是否为单个单词
 */
export function isSingleWord(text: string): boolean {
  const trimmed = text.trim();
  // 如果没有空格，且只包含字母、连字符或撇号，认为是单词
  if (!trimmed.includes(' ') && !trimmed.includes('\n') && !trimmed.includes('\t')) {
    // 检查是否只包含字母、数字、连字符、撇号
    return REGEX.SINGLE_WORD.test(trimmed);
  }
  return false;
}

/**
 * 计算文本的亮度（用于颜色检测）
 */
export function calculateBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

