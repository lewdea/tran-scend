// 语音播放工具函数

/**
 * 使用 Web Speech API 播放文本
 */
export function speakText(text: string, lang: 'en-US' | 'en-GB' = 'en-US'): void {
  if (!('speechSynthesis' in window)) {
    return;
  }

  // 停止当前播放
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // 稍微慢一点，更清晰
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

/**
 * 停止当前播放
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 检查是否正在播放
 */
export function isSpeaking(): boolean {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}

