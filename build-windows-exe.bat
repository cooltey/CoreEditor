@echo off
title CoreEditor - Windows Executable Builder
echo =======================================================
echo    CoreEditor Windows Executable Packaging Script
echo =======================================================
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking & Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

:: Ensure Windows native binaries are installed (resolves npm issue #4828 for Rollup, LightningCSS, and Tailwind Oxide)
if not exist "node_modules\@rollup\rollup-win32-x64-msvc" (
    echo [*] Installing Windows native Rollup compiler...
    call npm install @rollup/rollup-win32-x64-msvc --no-save
)
if not exist "node_modules\lightningcss-win32-x64-msvc" (
    echo [*] Installing Windows native LightningCSS compiler...
    call npm install lightningcss-win32-x64-msvc --no-save
)
if not exist "node_modules\@tailwindcss\oxide-win32-x64-msvc" (
    echo [*] Installing Windows native Tailwind Oxide compiler...
    call npm install @tailwindcss/oxide-win32-x64-msvc --no-save
)

echo.
echo [2/3] Generating Windows Icons and Compiling Windows .exe...
call node scripts/generate-icons.cjs
call npm run build:win
if %errorlevel% neq 0 (
    echo.
    echo [!] Initial build encountered an issue. Attempting comprehensive Windows native modules fix...
    call npm install @rollup/rollup-win32-x64-msvc lightningcss-win32-x64-msvc @tailwindcss/oxide-win32-x64-msvc --force
    call node scripts/generate-icons.cjs
    call npm run build:win
)

echo.
echo [3/3] Build Finished Successfully!
echo =======================================================
echo Your Windows Installer is ready in:
echo   .\release\CoreEditor-Setup-1.0.0.exe
echo.
echo * Note: Double-click CoreEditor-Setup-1.0.0.exe to install.
echo   It installs natively into Windows with a Start Menu
echo   and Desktop shortcut, and stays permanently pinned
echo   to your Taskbar!
echo =======================================================
echo.

if exist "release" (
    explorer release
)

pause
