# CoreEditor - Windows Executable (.exe) Packaging Guide

This project is fully configured with **Electron 44** and **Electron-Builder** to build standalone, 64-bit Windows portable executables (`.exe`) and installers (`Setup.exe`).

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
   - Run Electron-Builder to package the Windows executable (`npm run build:win`)
   - Open the `release\` folder upon completion!

Output executable location:
```
release\CoreEditor-Windows-Portable.exe
```

---

## 💻 Option 2: Command Line Build

Open PowerShell or Command Prompt (CMD) in the project directory:

```bash
# 1. Install dependencies
npm install

# 2. Compile and package the Windows portable executable (.exe)
npm run build:win
```

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

