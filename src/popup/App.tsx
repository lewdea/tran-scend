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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 0C8.27614 0 8.5 0.223858 8.5 0.5V2.5C8.5 2.77614 8.27614 3 8 3C7.72386 3 7.5 2.77614 7.5 2.5V0.5C7.5 0.223858 7.72386 0 8 0ZM8 13C8.27614 13 8.5 13.2239 8.5 13.5V15.5C8.5 15.7761 8.27614 16 8 16C7.72386 16 7.5 15.7761 7.5 15.5V13.5C7.5 13.2239 7.72386 13 8 13ZM0.5 8C0.5 7.72386 0.723858 7.5 1 7.5H3C3.27614 7.5 3.5 7.72386 3.5 8C3.5 8.27614 3.27614 8.5 3 8.5H1C0.723858 8.5 0.5 8.27614 0.5 8ZM13 7.5C12.7239 7.5 12.5 7.72386 12.5 8C12.5 8.27614 12.7239 8.5 13 8.5H15C15.2761 8.5 15.5 8.27614 15.5 8C15.5 7.72386 15.2761 7.5 15 7.5H13ZM2.34315 2.34315C2.53841 2.14789 2.855 2.14789 3.05025 2.34315L4.46447 3.75736C4.65973 3.95262 4.65973 4.2692 4.46447 4.46447C4.2692 4.65973 3.95262 4.65973 3.75736 4.46447L2.34315 3.05025C2.14789 2.855 2.14789 2.53841 2.34315 2.34315ZM11.5355 11.5355C11.7308 11.3403 12.0474 11.3403 12.2426 11.5355L13.6569 12.9497C13.8521 13.145 13.8521 13.4616 13.6569 13.6569C13.4616 13.8521 13.145 13.8521 12.9497 13.6569L11.5355 12.2426C11.3403 12.0474 11.3403 11.7308 11.5355 11.5355ZM2.34315 13.6569C2.14789 13.4616 2.14789 13.145 2.34315 12.9497L3.75736 11.5355C3.95262 11.3403 4.2692 11.3403 4.46447 11.5355C4.65973 11.7308 4.65973 12.0474 4.46447 12.2426L3.05025 13.6569C2.855 13.8521 2.53841 13.8521 2.34315 13.6569ZM13.6569 2.34315C13.8521 2.53841 13.8521 2.855 13.6569 3.05025L12.2426 4.46447C12.0474 4.65973 11.7308 4.65973 11.5355 4.46447C11.3403 4.2692 11.3403 3.95262 11.5355 3.75736L12.9497 2.34315C13.145 2.14789 13.4616 2.14789 13.6569 2.34315Z"
              fill="currentColor"
            />
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

