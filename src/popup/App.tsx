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
  const [status, setStatus] = useState<Status>({ show: false, type: '', message: '' });
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // 加载已保存的设置并应用颜色模式
  useEffect(() => {

    // 获取当前标签页域名
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        try {
          const url = new URL(tabs[0].url);
          const domain = url.hostname.replace(/^www\./, '').toLowerCase();
          setCurrentDomain(domain);

          // 检查是否已在黑名单中
          chrome.storage.local.get(['blockedDomains'], (result) => {
            const blockedDomains: string[] = result.blockedDomains || [];
            setIsBlocked(blockedDomains.includes(domain));
          });
        } catch {
          // 忽略错误
        }
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


  // 打开管理页面
  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  // 切换当前域名黑名单状态
  const handleToggleDomainBlock = async () => {
    if (!currentDomain) {
      return;
    }

    try {
      const result = await chrome.storage.local.get(['blockedDomains']);
      const blockedDomains: string[] = result.blockedDomains || [];

      let updatedDomains: string[];
      if (isBlocked) {
        // 从黑名单移除
        updatedDomains = blockedDomains.filter((d) => d !== currentDomain);
        setStatus({ show: true, type: 'success', message: '✓ 已启用按钮组' });
      } else {
        // 添加到黑名单
        if (blockedDomains.includes(currentDomain)) {
          return;
        }
        updatedDomains = [...blockedDomains, currentDomain];
        setStatus({ show: true, type: 'success', message: '✓ 已禁用按钮组' });
      }

      await chrome.storage.local.set({ blockedDomains: updatedDomains });
      setIsBlocked(!isBlocked);

      setTimeout(() => {
        setStatus({ show: false, type: '', message: '' });
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ show: true, type: 'error', message: '操作失败：' + errorMessage });
    }
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
        <h2>TranScend 设置</h2>
        <button
          type="button"
          onClick={handleOpenOptions}
          className="header-settings-btn"
          title="打开管理页面"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      {currentDomain && (
        <div className="domain-quick-action">
          <div className="domain-info">
            <span className="domain-label">当前页面：</span>
            <span className="domain-name">{currentDomain}</span>
            {isBlocked && <span className="domain-status">已禁用</span>}
          </div>
          <button
            type="button"
            onClick={handleToggleDomainBlock}
            className={`domain-toggle-btn ${isBlocked ? 'blocked' : ''}`}
          >
            {isBlocked ? '启用按钮组' : '禁用按钮组'}
          </button>
        </div>
      )}

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

