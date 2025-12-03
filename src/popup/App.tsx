import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { applyColorScheme } from '../utils/colorScheme';
import './App.css';

interface Status {
  show: boolean;
  type: 'success' | 'error' | '';
  message: string;
}

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4o-mini');
  const [status, setStatus] = useState<Status>({ show: false, type: '', message: '' });

  // 加载已保存的设置并应用颜色模式
  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'model'], (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
      if (result.model) {
        setModel(result.model);
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

  // 保存设置
  const handleSave = async () => {
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
      setStatus({ show: true, type: 'success', message: '✓ 设置保存成功' });

      setTimeout(() => {
        setStatus({ show: false, type: '', message: '' });
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ show: true, type: 'error', message: '保存失败：' + errorMessage });
    }
  };

  const iconUrl = chrome.runtime.getURL('icons/icon32.png');

  return (
    <div className="container">
      <div className="header">
        <img src={iconUrl} alt="TranScend" className="header-icon" />
        <h2>TranScend 设置</h2>
      </div>

      <div className="form-group">
        <label htmlFor="apiKey">OpenAI API Key</label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
        <div className="info">你的 API Key 仅保存在本地</div>
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

      <button onClick={handleSave}>保存设置</button>

      {status.show && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

// 挂载应用
function initApp() {
  console.log('initApp');
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

