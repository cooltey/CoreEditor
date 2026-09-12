# CoreEditor 🐕🎯

A high-performance, desktop-grade Markdown & Text Editor inspired by Sublime Text and modern Windows 11 Fluent ergonomics. Features an integrated **Core AI Agent**, real-time synchronized live preview, extensive typesetting tools, and one-click Windows portable `.exe` compilation.

![CoreEditor Preview](public/doge-target-icon.svg)

---

## ✨ Key Features

- **🐕 Core AI Writing Agent (Ctrl+J)**
  - Dual-mode architecture: Server-side Google Gemini integration and custom endpoint support (Ollama, LM Studio, or OpenAI-compatible gateways).
  - Document-aware assistance: Continue writing, grammar proofreading, multilingual translation, and automated table generation.
  - Interactive actions: Insert directly at cursor or replace selection/document with one click.
- **⚡ Sublime-Grade Editing Experience**
  - Instant response with low-latency typing.
  - Interactive minimap, line numbers, and active line highlighting.
  - Full tab management: New tabs, rename, close, tab history, and drag reordering.
  - Multi-syntax support: Markdown, Plain Text, JavaScript, TypeScript, HTML, CSS, JSON, Python, and SQL.
- **🔄 Real-Time Synchronized Markdown Preview**
  - Proportional synchronized scrolling between the editor and preview panes.
  - Split View, Editor-Only, or Preview-Only layouts (`Ctrl+E`).
  - GitHub-flavored Markdown rendering with syntax-highlighted code blocks and interactive checklist support.
- **🛠️ Typography & Formatting Bar**
  - Bold, Italic, Strikethrough, Inline Code, and Blockquotes.
  - Table Generator modal with custom rows and columns.
  - Casing converter (UPPERCASE, lowercase, Title Case, Capitalized Case).
  - Whitespace cleaning (Trim Trailing Whitespace, Remove Empty Lines).
- **💾 Robust Persistence & Auto-Save**
  - Debounced auto-save with persistent status indicator (`Ctrl+Shift+A` to toggle).
  - Local state preservation across sessions.
  - Full Find & Replace with Regular Expressions (`Ctrl+F` / `Ctrl+H`).
- **📦 Native Windows Desktop Packaging**
  - Pre-configured Electron 44 and Electron-Builder setup.
  - One-click build script (`build-windows-exe.bat`) producing a standalone, 100% offline portable `.exe`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/coreeditor.git
cd coreeditor

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## 🤖 AI Agent Setup (Optional)

CoreEditor works completely offline without any API keys as a desktop Markdown editor. If you want to use the AI Agent:

1. **Google Gemini (Default)**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY="your_actual_gemini_api_key"
     ```
2. **Local / Custom Endpoints (Ollama, LM Studio, OpenAI)**:
   - Click the **AI Agent** button (`Ctrl+J`) in the editor.
   - Open **Connection Settings (⚙️)**.
   - Select **External / Ollama (OpenAI format)**.
   - Set Endpoint (e.g. `http://localhost:11434/v1/chat/completions`) and model name.
   - Keys entered here are stored strictly in your local browser storage and never transmitted to external servers.

---

## 🖥️ Building Windows Desktop Executable (.exe)

### Option 1: Automatic Batch Script
On Windows, simply double-click:
```cmd
build-windows-exe.bat
```

### Option 2: Command Line
```bash
# Build standalone Portable .exe
npm run build:win

# Build Windows Setup Wizard (NSIS Installer)
npm run package:win-installer
```
The output file will be generated in the `release/` folder.

For detailed packaging instructions, see [README_WINDOWS_EXE.md](README_WINDOWS_EXE.md).

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut | Description |
| :--- | :--- | :--- |
| **AI Agent** | `Ctrl + J` | Open or toggle the AI Writing Assistant |
| **Command Palette** | `Ctrl + P` | Fast command launcher and file switcher |
| **New Tab** | `Ctrl + N` | Create a new scratchpad tab |
| **Save Document** | `Ctrl + S` | Save active file |
| **Find & Replace** | `Ctrl + F` / `Ctrl + H` | Document search with regex and match counter |
| **Toggle Layout** | `Ctrl + E` | Cycle Split, Editor, and Preview view modes |
| **Bold / Italic** | `Ctrl + B` / `Ctrl + I` | Apply markdown formatting to selection |
| **Toggle Auto-Save** | `Ctrl + Shift + A` | Enable or disable automatic debounced saving |

---

## 📄 License

MIT License. Open source and free to use.
