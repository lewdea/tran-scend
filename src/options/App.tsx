import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { applyColorScheme } from '../utils/colorScheme';
import './App.css';

type TabType = 'api' | 'domains' | 'buttons';

interface ButtonSettings {
  learn: boolean;
  translate: boolean;
  check: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('api');
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4o-mini');
  const [blockedDomains, setBlockedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState<string>('');
  const [buttonSettings, setButtonSettings] = useState<ButtonSettings>({
    learn: true,
    translate: true,
    check: true,
  });
  const [status, setStatus] = useState<{ show: boolean; type: 'success' | 'error' | ''; message: string }>({
    show: false,
    type: '',
    message: '',
  });

  // 加载已保存的设置
  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'model', 'blockedDomains', 'buttonSettings'], (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
      if (result.model) {
        setModel(result.model);
      }
      if (result.blockedDomains && Array.isArray(result.blockedDomains)) {
        setBlockedDomains(result.blockedDomains);
      }
      if (result.buttonSettings) {
        setButtonSettings(result.buttonSettings);
      }
    });

    // 应用颜色模式
    applyColorScheme(document.body);

    // 监听系统颜色模式变化
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyColorScheme(document.body);
      };
      darkModeQuery.addEventListener('change', handleChange);
      return () => {
        darkModeQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  // 切换 Tab 时清除状态
  useEffect(() => {
    setStatus({ show: false, type: '', message: '' });
  }, [activeTab]);

  // 保存 API 设置
  const handleSaveApiConfig = async () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setStatus({ show: true, type: 'error', message: '请输入 API Key' });
      return;
    }

    if (!trimmedKey.startsWith('sk-')) {
      setStatus({ show: true, type: 'error', message: 'API Key 格式不正确' });
      return;
    }

    try {
      await chrome.storage.local.set({ apiKey: trimmedKey, model });
      setStatus({ show: true, type: 'success', message: '✓ API 设置保存成功' });

      setTimeout(() => {
        setStatus({ show: false, type: '', message: '' });
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ show: true, type: 'error', message: '保存失败：' + errorMessage });
    }
  };

  // 切换按钮状态（自动保存）
  const toggleButton = async (key: keyof ButtonSettings) => {
    // 如果当前是开启状态，且尝试关闭
    if (buttonSettings[key]) {
      // 检查是否是最后一个开启的按钮
      const enabledCount = Object.values(buttonSettings).filter(Boolean).length;
      if (enabledCount <= 1) {
        setStatus({ show: true, type: 'error', message: '请至少保留一个功能按钮' });
        return;
      }
    }

    const newSettings = {
      ...buttonSettings,
      [key]: !buttonSettings[key]
    };

    setButtonSettings(newSettings);

    // 如果之前有错误提示，操作成功后清除
    if (status.show) {
      setStatus({ show: false, type: '', message: '' });
    }

    try {
      await chrome.storage.local.set({ buttonSettings: newSettings });
      // 不显示成功提示，因为是自动保存，避免打扰用户
      // 除非出错才提示
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ show: true, type: 'error', message: '保存失败：' + errorMessage });
    }
  };

  // 添加域名到黑名单
  const handleAddDomain = async () => {
    const trimmedDomain = newDomain.trim().toLowerCase();

    if (!trimmedDomain) {
      setStatus({ show: true, type: 'error', message: '请输入域名' });
      return;
    }

    // 验证域名格式
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(trimmedDomain)) {
      setStatus({ show: true, type: 'error', message: '域名格式不正确' });
      return;
    }

    if (blockedDomains.includes(trimmedDomain)) {
      setStatus({ show: true, type: 'error', message: '该域名已在黑名单中' });
      return;
    }

    const updatedDomains = [...blockedDomains, trimmedDomain];
    await chrome.storage.local.set({ blockedDomains: updatedDomains });
    setBlockedDomains(updatedDomains);
    setNewDomain('');
    setStatus({ show: true, type: 'success', message: '✓ 域名已添加' });

    setTimeout(() => {
      setStatus({ show: false, type: '', message: '' });
    }, 2000);
  };

  // 从黑名单移除域名
  const handleRemoveDomain = async (domain: string) => {
    const updatedDomains = blockedDomains.filter((d) => d !== domain);
    await chrome.storage.local.set({ blockedDomains: updatedDomains });
    setBlockedDomains(updatedDomains);
    setStatus({ show: true, type: 'success', message: '✓ 域名已移除' });

    setTimeout(() => {
      setStatus({ show: false, type: '', message: '' });
    }, 2000);
  };



  const iconUrl = chrome.runtime.getURL('icons/icon32.png');

  return (
    <div className="container">
      <div className="app-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      <div className="header">
        <img src={iconUrl} alt="TranScend" className="header-icon" />
        <h2>TranScend 管理</h2>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <button
            type="button"
            className={`sidebar-item ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <span className="sidebar-icon">🔑</span>
            <span className="sidebar-text">API 配置</span>
          </button>
          <button
            type="button"
            className={`sidebar-item ${activeTab === 'buttons' ? 'active' : ''}`}
            onClick={() => setActiveTab('buttons')}
          >
            <span className="sidebar-icon">🔘</span>
            <span className="sidebar-text">按钮配置</span>
          </button>
          <button
            type="button"
            className={`sidebar-item ${activeTab === 'domains' ? 'active' : ''}`}
            onClick={() => setActiveTab('domains')}
          >
            <span className="sidebar-icon">🚫</span>
            <span className="sidebar-text">域名黑名单</span>
          </button>
        </div>

        <div className="content-area">
          {activeTab === 'api' && (
            <div className="content-panel">
              <h3>API 配置</h3>
              <p className="section-description">
                配置 OpenAI API Key 和模型，用于提供翻译和学习功能。
              </p>

              <div className="form-group">
                <label htmlFor="apiKey">OpenAI API Key</label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <div className="info">你的 API Key 仅保存在本地，不会上传到任何服务器</div>
              </div>

              <div className="form-group">
                <label htmlFor="model">模型选择</label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (推荐)</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <button onClick={handleSaveApiConfig} className="btn-primary">保存 API 设置</button>

              {status.show && (
                <div className={`status ${status.type}`}>
                  {status.message}
                </div>
              )}
            </div>
          )}

          {activeTab === 'buttons' && (
            <div className="content-panel">
              <h3>按钮配置</h3>
              <p className="section-description">
                选择在划词时显示的浮动按钮。您可以根据需要启用或禁用特定功能，但至少需要保留一个。
              </p>

              <div className="button-config-list">
                <div
                  className={`config-item ${buttonSettings.learn ? 'active' : ''}`}
                  onClick={() => toggleButton('learn')}
                >
                  <div className="config-item-icon">💡</div>
                  <div className="config-item-info">
                    <div className="config-item-title">Learn (学习)</div>
                    <div className="config-item-desc">解释单词或短语的含义、用法和例句</div>
                  </div>
                  <div className="config-toggle">
                    <div className="toggle-track">
                      <div className="toggle-thumb"></div>
                    </div>
                  </div>
                </div>

                <div
                  className={`config-item ${buttonSettings.translate ? 'active' : ''}`}
                  onClick={() => toggleButton('translate')}
                >
                  <div className="config-item-icon">🌐</div>
                  <div className="config-item-info">
                    <div className="config-item-title">Translate (翻译)</div>
                    <div className="config-item-desc">将选中的文本翻译成中文</div>
                  </div>
                  <div className="config-toggle">
                    <div className="toggle-track">
                      <div className="toggle-thumb"></div>
                    </div>
                  </div>
                </div>

                <div
                  className={`config-item ${buttonSettings.check ? 'active' : ''}`}
                  onClick={() => toggleButton('check')}
                >
                  <div className="config-item-icon">🔍</div>
                  <div className="config-item-info">
                    <div className="config-item-title">Check (检查)</div>
                    <div className="config-item-desc">检查语法错误并提供修改建议</div>
                  </div>
                  <div className="config-toggle">
                    <div className="toggle-track">
                      <div className="toggle-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>

              {status.show && (
                <div className={`status ${status.type}`}>
                  {status.message}
                </div>
              )}
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="content-panel">
              <h3>域名黑名单</h3>
              <p className="section-description">
                在黑名单中的域名将不会显示按钮组，避免与网页自有工具冲突。
              </p>

              <div className="form-group">
                <label htmlFor="newDomain">添加域名</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="newDomain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddDomain();
                      }
                    }}
                    placeholder="example.com"
                  />
                </div>
                <div className="info">输入域名（不需要包含 www 或协议）</div>
              </div>

              <button onClick={handleAddDomain} className="btn-primary">添加域名</button>

              {blockedDomains.length > 0 && (
                <div className="domain-list">
                  <h4>已禁用的域名 ({blockedDomains.length})</h4>
                  <ul>
                    {blockedDomains.map((domain) => (
                      <li key={domain}>
                        <span>{domain}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDomain(domain)}
                          className="btn-remove"
                          title="移除"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {status.show && (
                <div className={`status ${status.type}`}>
                  {status.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 挂载应用
function initApp() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}

// 确保 DOM 加载完成后再挂载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

