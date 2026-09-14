# CoreEditor - Windows Desktop Application (.exe) Packaging Guide

This project is fully configured with **Electron 44** and **Electron-Builder** to build native Windows Installers (`CoreEditor-Setup-1.0.0.exe`) as well as standalone portable executables.

---

## ⚡ Option 1: One-Click Automatic Build on Windows (Recommended)

1. Click **Download as ZIP** (or `git clone`) and extract it to your Windows PC.
2. Ensure [Node.js](https://nodejs.org/) (v18+ or v20+) is installed.
3. In the extracted project root directory, double-click:
   ```cmd
   build-windows-exe.bat
   ```
4. The script will automatically:
   - Check and install required dependencies (`npm install`)
   - Compile Vite static assets (`npm run build`)
   - Run Electron-Builder to package the Windows Installer (`npm run build:win`)
   - Open the `release\` folder upon completion!

Output installer location:
```
release\CoreEditor-Setup-1.0.0.exe
```

Double-click `CoreEditor-Setup-1.0.0.exe` to install CoreEditor onto your PC. Once installed:
- It appears in your **Windows Start Menu** and creates a **Desktop Shortcut**.
- You can **Pin to Taskbar** permanently — it will never disappear after closing or restarting your PC!
- An uninstaller is also registered in Windows "Installed apps" settings.

---

## 💻 Option 2: Command Line Build

Open PowerShell or Command Prompt (CMD) in the project directory:

```bash
# 1. Install dependencies
npm install

# 2. Compile and package the Windows Installer (.exe)
npm run build:win
```

### Build Commands Reference:
- `npm run build:win`: Builds the standard **Windows Installer** (`release/CoreEditor-Setup-1.0.0.exe`)
- `npm run build:portable`: Builds a single standalone **Portable executable** (`release/CoreEditor-Portable.exe`)

> **Troubleshooting Note (Windows native modules)**:
> If npm on Windows skips native Rust/C++ binaries (`lightningcss`, `rollup`, or `@tailwindcss/oxide`), run:
> ```bash
> npm install @rollup/rollup-win32-x64-msvc lightningcss-win32-x64-msvc @tailwindcss/oxide-win32-x64-msvc
> ```
> And re-run `npm run build:win`. Alternatively, double-click `build-windows-exe.bat` which auto-installs them.

If you need a standard Windows installer (NSIS Setup wizard):
```bash
npm run package:win-installer
```

---

## 🚀 Desktop Development Mode (Without Packaging)

To launch and test the desktop application window directly in development:
```bash
# Double-click run-windows-desktop.bat
# Or execute in terminal:
npm run electron
```

---

## 📁 Core Desktop Configuration Files

- `electron/main.cjs`: Electron main process (handles custom titlebar, minimize/maximize/close, multi-process lifecycle)
- `electron/preload.cjs`: Secure ContextBridge IPC communication channel
- `package.json`: Windows build configurations and Electron-Builder settings
- `build-windows-exe.bat`: One-click automated Windows packaging batch script
- `run-windows-desktop.bat`: Direct desktop development launch script
- `vite.config.ts`: Configured with `base: './'` for local `file://` protocol compatibility

