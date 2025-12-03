// 存储管理工具

import type { ApiConfig } from '../types';
import { API_CONFIG } from '../constants';

/**
 * 获取 API 配置
 */
export async function getApiConfig(): Promise<ApiConfig> {
  const config = await chrome.storage.local.get(['apiKey', 'model']) as ApiConfig;
  return {
    apiKey: config.apiKey,
    model: config.model || API_CONFIG.DEFAULT_MODEL,
  };
}

/**
 * 保存 API 配置
 */
export async function saveApiConfig(config: ApiConfig): Promise<void> {
  await chrome.storage.local.set(config);
}

