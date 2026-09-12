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

echo.
echo [2/3] Compiling React assets and Packaging Windows .exe...
call npm run build:win
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build encountered an issue. 
    echo Trying fallback portable packaging command...
    call npx electron-builder --win portable
)

echo.
echo [3/3] Build Finished Successfully!
echo =======================================================
echo Your standalone Windows executable is ready in:
echo   .\release\CoreEditor-Windows-Portable.exe
echo =======================================================
echo.

if exist "release" (
    explorer release
)

pause
