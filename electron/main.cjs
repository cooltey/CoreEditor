const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Resolve app icon across both dev and packaged production builds
// Windows requires multi-resolution .ico to render full color in Taskbar and Alt+Tab
function getAppIconPath() {
  const isWin = process.platform === 'win32';
  const candidates = isWin
    ? [
        path.join(__dirname, '../build/icon.ico'),
        path.join(__dirname, '../public/icon.ico'),
        path.join(__dirname, '../dist/icon.ico'),
        path.join(__dirname, 'resources/icon.ico'),
        path.join(process.resourcesPath, 'icon.ico'),
        path.join(__dirname, '../public/icon.png'),
        path.join(__dirname, '../dist/icon.png'),
      ]
    : [
        path.join(__dirname, '../public/icon.png'),
        path.join(__dirname, '../dist/icon.png'),
        path.join(__dirname, '../build/icon.png'),
        path.join(__dirname, '../public/doge-target-icon.svg'),
      ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

// Crucial for Windows: ensures taskbar pinning, icons, and Start Menu shortcuts persist permanently
if (process.platform === 'win32') {
  app.setAppUserModelId('com.coreeditor.app');
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'CoreEditor',
    icon: getAppIconPath(),
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 500,
    frame: false, // Use our custom Windows 11 title bar
    titleBarStyle: 'hidden',
    backgroundColor: '#1e1e24',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    show: false,
  });

  // Load production build or dev server
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window control IPC handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
