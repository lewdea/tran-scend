# TranScend

<div align="center">

**Learn through translation.** A smart Chrome extension that helps you learn English while browsing the web.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple.svg)](https://vitejs.dev/)

An intelligent Chrome browser extension that provides detailed learning content, translation, or grammar checking when you select text on any webpage.

</div>

---

## ✨ Features

### 🎓 Learn
- **Word Learning**: When selecting a single English word, provides:
  - Pronunciation with phonetic symbols (US/UK variants)
  - All Chinese meanings and parts of speech
  - Etymology and similar words
  - Native speaker common collocations
- **Phrase Learning**: When selecting phrases or sentences, provides translation and detailed explanations

### 🌐 Translate
- Translates Chinese text into idiomatic, natural English expressions
- Provides reasoning and context explanations
- Offers multiple alternative expressions with usage scenarios

### ✅ Check
- Checks English text for clarity and idiomaticity
- Identifies grammar errors, unnatural expressions, and other issues
- Provides improvement suggestions and idiomatic alternatives
- Gives overall scores and usage advice

### 🎨 Additional Features
- **Smart Positioning**: Result popup automatically positions near selected text
- **Dark Mode**: Automatically adapts to system color scheme
- **Streaming Response**: Real-time display of AI-generated content
- **Rich Text Display**: Supports HTML-formatted detailed content
- **Privacy & Security**: API Key stored locally only

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16
- pnpm (recommended) or npm/yarn
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tran-scend.git
   cd tran-scend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Load into Chrome**
   - Open Chrome browser and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked"
   - Select the `dist` directory in the project

5. **Configure API Key**
   - Click the extension icon in the browser toolbar
   - Enter your OpenAI API Key
   - Select a model (GPT-4o Mini recommended)
   - Click "Save Settings"

## 📖 Usage

1. **Learn a word**: Select an English word on any webpage and click the "Learn" button
2. **Translate Chinese**: Select Chinese text and click the "Translate" button
3. **Check English**: Select English text and click the "Check" button

Results are displayed in a popup near the selected text, with support for:
- Viewing detailed content
- One-click text copying
- Manual popup closing

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Extension Framework**: Chrome Extension Manifest V3
- **AI Service**: OpenAI API (GPT-4o / GPT-4o Mini)
- **Styling**: CSS3 (with dark mode support)
- **Package Manager**: pnpm

## 📁 Project Structure

```
tran-scend/
├── src/
│   ├── popup/              # Popup page (settings interface)
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.html
│   ├── content/            # Content scripts
│   │   ├── index.tsx       # Main entry
│   │   ├── index.css       # Styles
│   │   ├── ui/             # UI components
│   │   │   ├── ButtonGroup.ts
│   │   │   └── ResultContainer.ts
│   │   ├── handlers/       # Event handlers
│   │   └── listeners/      # Event listeners
│   ├── background/         # Background scripts
│   │   ├── index.ts        # Service Worker
│   │   ├── api/            # API calls
│   │   ├── handlers/       # Request handlers
│   │   └── prompts/        # AI prompt templates
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Constants
│   └── manifest.json       # Extension configuration
├── public/                 # Static resources
│   └── icons/              # Icon files
├── dist/                   # Build output
├── release/                # Package output (.zip)
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## 🧑‍💻 Development

### Development Mode

```bash
pnpm dev
```

In development mode, Vite watches for file changes and automatically rebuilds.

### Production Build

```bash
pnpm build
```

After building:
- The `dist/` directory contains the extension files ready to load into Chrome
- `release/tran-scend.zip` contains the packaged extension (ready for distribution)

### Code Structure

- **Content Script**: Injects buttons and result popups into web pages
- **Background Script**: Handles communication with the OpenAI API
- **Popup**: Provides settings interface for managing API Key and model selection
- **Streaming API**: Uses streaming responses to display AI-generated content in real-time

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Write code in TypeScript
- Follow ESLint rules
- Keep code clean and readable
- Add necessary comments

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) - For providing powerful AI capabilities
- [Vite](https://vitejs.dev/) - For the fast build tool
- [React](https://reactjs.org/) - For the excellent frontend framework
- [@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools) - For Chrome extension development tools

## 📮 Feedback

If you have any questions or suggestions, please:
- Open an [Issue](https://github.com/your-username/tran-scend/issues)
- Submit a [Pull Request](https://github.com/your-username/tran-scend/pulls)

---

<div align="center">

**Made with ❤️ for language learners**

⭐ If this project helps you, please give it a star!

</div>
