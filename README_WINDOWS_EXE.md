# SublimeMark - Windows 可執行檔 (.exe) 打包指南

本專案已完成 **Electron 44** 與 **Electron-Builder** 的完整桌面端配置，並支援直接產出 Windows 64-bit 綠色免安裝可執行檔（Portable .exe）以及安裝檔（Setup.exe）。

---

## ⚡ 方法一：在 Windows 上一鍵自動打包（推薦）

1. 從右上角選單點選 **Download as ZIP**（或 git clone）並解壓縮到您的 Windows 電腦。
2. 確認已安裝 [Node.js](https://nodejs.org/) (v18+ 或 v20+)。
3. 在解壓縮後的專案根目錄中，直接雙擊：
   ```cmd
   build-windows-exe.bat
   ```
4. 腳本會自動完成：
   - 檢查並安裝相依套件 (`npm install`)
   - 編譯 Vite 靜態資源 (`npm run build`)
   - 啟動 Electron-Builder 打包 Windows 執行檔 (`npm run build:win`)
   - 打包完成後會自動彈出 `release\` 資料夾！

產出的執行檔位置：
```
release\SublimeMark-Windows-Portable.exe
```

---

## 💻 方法二：使用終端機指令打包

在專案目錄下開啟 PowerShell 或 Command Prompt (CMD)：

```bash
# 1. 安裝套件
npm install

# 2. 編譯並打包 Windows 免安裝執行檔 (Portable .exe)
npm run build:win
```

如果您需要製作標準 Windows 安裝檔（NSIS Setup.exe）：
```bash
npm run package:win-installer
```

---

## 🚀 桌面端開發即時運行（無需先打包成 .exe）

想要在桌面端直接開啟視窗進行測試：
```bash
# 直接雙擊 run-windows-desktop.bat
# 或在命令列執行：
npm run electron
```

---

## 📁 核心桌面配置清單

- `electron/main.cjs`：Electron 主程序（負責自定義 Windows 11 標題列、視窗最小化/最大化/關閉、多行程生命週期管理）
- `electron/preload.cjs`：ContextBridge IPC 安全通信通道
- `package.json`：預設 Windows 打包設定與 Electron-builder 配置
- `build-windows-exe.bat`：一鍵全自動打包批次檔
- `run-windows-desktop.bat`：桌面模式直接啟動腳本
- `vite.config.ts`：設置 `base: './'` 確保 Electron 本地檔案協定 (`file://`) 完美載入
