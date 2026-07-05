const { app, BrowserWindow, Menu, shell, ipcMain, dialog, session } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { fileURLToPath } = require('url');
const { getContentSecurityPolicy } = require('./securityPolicy.cjs');

let mainWindow;

const isDev = !app.isPackaged;
const DEV_SERVER_ORIGIN = 'http://localhost:5173';
const appDistPath = path.join(__dirname, 'dist');
const contentSecurityPolicy = getContentSecurityPolicy({ isDev });

function isPathInside(parentPath, childPath) {
  const relativePath = path.relative(parentPath, childPath);
  return relativePath === '' || (
    Boolean(relativePath)
    && !relativePath.startsWith('..')
    && !path.isAbsolute(relativePath)
  );
}

function isAppUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (isDev) {
      return parsedUrl.origin === DEV_SERVER_ORIGIN;
    }

    if (parsedUrl.protocol !== 'file:') {
      return false;
    }

    return isPathInside(appDistPath, fileURLToPath(parsedUrl));
  } catch {
    return false;
  }
}

function isSafeExternalUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol === 'https:') {
      return parsedUrl.host === 'github.com'
        && parsedUrl.pathname.startsWith('/SWEN-661-Team-3/Team_3_SWEN_661');
    }

    if (parsedUrl.protocol === 'tel:') {
      return /^tel:[+0-9().\-\s%]+$/.test(url);
    }
  } catch {
    return false;
  }

  return false;
}

function openExternalIfSafe(url) {
  if (isSafeExternalUrl(url)) {
    shell.openExternal(url);
  }
}

function isTrustedSender(event) {
  return Boolean(event?.senderFrame?.url && isAppUrl(event.senderFrame.url));
}

function applySecurityHeaders() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [contentSecurityPolicy],
      },
    });
  });
}

function applyPermissionPolicy() {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
}

function applyWebContentsSecurity(contents) {
  contents.on('will-navigate', (event, navigationUrl) => {
    if (isAppUrl(navigationUrl)) {
      return;
    }

    event.preventDefault();
    openExternalIfSafe(navigationUrl);
  });

  contents.setWindowOpenHandler(({ url }) => {
    openExternalIfSafe(url);
    return { action: 'deny' };
  });

  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}

function sendMenuAction(action) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('menu-action', action);
  }
}

function buildMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac
      ? [{
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        }]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Appointment',
          accelerator: 'CmdOrCtrl+N',
          click: () => sendMenuAction('new-record'),
        },
        {
          label: 'Save Plan',
          accelerator: 'CmdOrCtrl+S',
          click: () => sendMenuAction('save'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+F',
          click: () => sendMenuAction('search'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: "Today's Plan",
          accelerator: 'CmdOrCtrl+1',
          click: () => sendMenuAction('view-todays-plan'),
        },
        {
          label: 'Care Team',
          accelerator: 'CmdOrCtrl+2',
          click: () => sendMenuAction('view-care-team'),
        },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendMenuAction('open-settings'),
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Emergency Help',
          accelerator: 'F2',
          click: () => sendMenuAction('emergency'),
        },
        { type: 'separator' },
        {
          label: 'CareConnect Help',
          accelerator: 'F1',
          click: () => sendMenuAction('help'),
        },
        {
          label: 'Keyboard Shortcuts',
          click: () => sendMenuAction('shortcuts'),
        },
        { type: 'separator' },
        {
          label: 'Learn More',
          click: () => openExternalIfSafe('https://github.com/SWEN-661-Team-3/Team_3_SWEN_661'),
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'CareConnect',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  applySecurityHeaders();
  applyPermissionPolicy();
  Menu.setApplicationMenu(buildMenu());
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('web-contents-created', (_event, contents) => {
  applyWebContentsSecurity(contents);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('show-help', (event) => {
  if (isTrustedSender(event)) {
    sendMenuAction('help');
  }
});

ipcMain.handle('save-plan-text', async (event, planText) => {
  if (!isTrustedSender(event)) {
    throw new Error('Blocked IPC message from untrusted sender.');
  }

  if (typeof planText !== 'string') {
    throw new Error('Plan text must be a string.');
  }

  const targetWindow = BrowserWindow.getFocusedWindow() ?? mainWindow;
  const { canceled, filePath } = await dialog.showSaveDialog(targetWindow, {
    title: "Save Today's Plan",
    defaultPath: path.join(app.getPath('documents'), 'todays-plan.txt'),
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
    ],
  });

  if (canceled || !filePath) {
    return { canceled: true };
  }

  await fs.writeFile(filePath, planText, 'utf8');
  return { saved: true, filePath };
});
