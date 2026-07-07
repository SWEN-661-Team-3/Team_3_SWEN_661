const path = require('path');
const { pathToFileURL } = require('url');

const trustedRendererUrl = pathToFileURL(
  path.join(__dirname, '..', '..', 'dist', 'index.html'),
).toString();

const trustedIpcEvent = { senderFrame: { url: trustedRendererUrl } };
const untrustedIpcEvent = { senderFrame: { url: 'https://attacker.example' } };

const loadMainProcess = ({
  isPackaged = true,
  runReadyCallback = true,
  focusedWindow = null,
  allWindows = [],
  saveDialogResult = { canceled: true },
} = {}) => {
  jest.resetModules();

  const mockWindowSend = jest.fn();
  const mockLoadFile = jest.fn();
  const mockLoadURL = jest.fn();
  const mockWriteFile = jest.fn();
  const appEvents = {};
  const ipcEvents = {};
  const ipcHandlers = {};
  const webContentsEvents = {};

  const mockWindow = {
    isDestroyed: jest.fn(() => false),
    loadFile: mockLoadFile,
    loadURL: mockLoadURL,
    webContents: {
      on: jest.fn((eventName, handler) => {
        webContentsEvents[eventName] = handler;
      }),
      send: mockWindowSend,
      setWindowOpenHandler: jest.fn(),
    },
  };

  const MockBrowserWindow = jest.fn(() => mockWindow);
  MockBrowserWindow.getAllWindows = jest.fn(() => allWindows);
  MockBrowserWindow.getFocusedWindow = jest.fn(() => focusedWindow);

  const mockElectron = {
    app: {
      getPath: jest.fn(() => 'C:\\Users\\CareConnect\\Documents'),
      isPackaged,
      name: 'CareConnect',
      on: jest.fn((eventName, handler) => {
        appEvents[eventName] = handler;
      }),
      quit: jest.fn(),
      whenReady: jest.fn(() => ({
        then: (callback) => {
          if (runReadyCallback) callback();
        },
      })),
    },
    BrowserWindow: MockBrowserWindow,
    dialog: {
      showSaveDialog: jest.fn().mockResolvedValue(saveDialogResult),
    },
    session: {
      defaultSession: {
        setPermissionRequestHandler: jest.fn(),
        webRequest: {
          onHeadersReceived: jest.fn(),
        },
      },
    },
    ipcMain: {
      handle: jest.fn((channel, handler) => {
        ipcHandlers[channel] = handler;
      }),
      on: jest.fn((channel, handler) => {
        ipcEvents[channel] = handler;
      }),
    },
    Menu: {
      buildFromTemplate: jest.fn((template) => ({ template })),
      setApplicationMenu: jest.fn(),
    },
    shell: {
      openExternal: jest.fn(),
    },
  };

  jest.doMock('electron', () => mockElectron);
  jest.doMock('fs/promises', () => ({
    writeFile: mockWriteFile,
  }));

  require('../../main');

  return {
    appEvents,
    ipcEvents,
    ipcHandlers,
    mockElectron,
    mockLoadFile,
    mockLoadURL,
    mockWindow,
    mockWindowSend,
    webContentsEvents,
    mockWriteFile,
  };
};

const createMockWebContents = () => {
  const events = {};
  const contents = {
    on: jest.fn((eventName, handler) => {
      events[eventName] = handler;
    }),
    setWindowOpenHandler: jest.fn(),
  };

  return { contents, events };
};

const findMenuItem = (template, label) => {
  for (const item of template) {
    if (item.label === label) return item;
    if (Array.isArray(item.submenu)) {
      const match = findMenuItem(item.submenu, label);
      if (match) return match;
    }
  }
  return null;
};

describe('main process IPC', () => {
  afterEach(() => {
    jest.dontMock('electron');
    jest.dontMock('fs/promises');
  });

  it('creates a hardened BrowserWindow', () => {
    const { mockElectron } = loadMainProcess();

    expect(mockElectron.BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
      webPreferences: expect.objectContaining({
        allowRunningInsecureContent: false,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
        webviewTag: false,
      }),
    }));
  });

  it('applies a restrictive Content Security Policy header', () => {
    const { mockElectron } = loadMainProcess();
    const headerHandler = mockElectron.session.defaultSession.webRequest.onHeadersReceived
      .mock.calls[0][0];
    const callback = jest.fn();

    headerHandler({ responseHeaders: { 'X-Test': ['ok'] } }, callback);

    expect(callback).toHaveBeenCalledWith({
      responseHeaders: expect.objectContaining({
        'Content-Security-Policy': [
          expect.stringContaining("default-src 'self'"),
        ],
        'X-Test': ['ok'],
      }),
    });
  });

  it('uses the production CSP by default', () => {
    const { mockElectron } = loadMainProcess();
    const headerHandler = mockElectron.session.defaultSession.webRequest.onHeadersReceived
      .mock.calls[0][0];
    const callback = jest.fn();

    headerHandler({ responseHeaders: {} }, callback);

    const csp = callback.mock.calls[0][0].responseHeaders['Content-Security-Policy'][0];
    expect(csp).toContain("script-src 'self';");
    expect(csp).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
    expect(csp).not.toContain('ws://localhost:5173');
  });

  it('allows only the Vite development script and websocket requirements in dev CSP', () => {
    const { mockElectron } = loadMainProcess({ isPackaged: false });
    const headerHandler = mockElectron.session.defaultSession.webRequest.onHeadersReceived
      .mock.calls[0][0];
    const callback = jest.fn();

    headerHandler({ responseHeaders: {} }, callback);

    const csp = callback.mock.calls[0][0].responseHeaders['Content-Security-Policy'][0];
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("connect-src 'self' ws://localhost:5173");
  });

  it('denies renderer permission requests by default', () => {
    const { mockElectron } = loadMainProcess();
    const permissionHandler = mockElectron.session.defaultSession.setPermissionRequestHandler
      .mock.calls[0][0];
    const callback = jest.fn();

    permissionHandler({}, 'notifications', callback);

    expect(callback).toHaveBeenCalledWith(false);
  });

  it('blocks unexpected navigation, new windows, and webviews', () => {
    const { appEvents, mockElectron } = loadMainProcess({ isPackaged: false });
    const { contents, events } = createMockWebContents();

    appEvents['web-contents-created']({}, contents);

    const blockedNavigation = { preventDefault: jest.fn() };
    events['will-navigate'](blockedNavigation, 'https://attacker.example');
    expect(blockedNavigation.preventDefault).toHaveBeenCalled();

    const allowedNavigation = { preventDefault: jest.fn() };
    events['will-navigate'](allowedNavigation, 'http://localhost:5173/care-team');
    expect(allowedNavigation.preventDefault).not.toHaveBeenCalled();

    const webviewEvent = { preventDefault: jest.fn() };
    events['will-attach-webview'](webviewEvent);
    expect(webviewEvent.preventDefault).toHaveBeenCalled();

    const windowOpenHandler = contents.setWindowOpenHandler.mock.calls[0][0];
    expect(windowOpenHandler({ url: 'https://attacker.example' })).toEqual({ action: 'deny' });
    expect(mockElectron.shell.openExternal).not.toHaveBeenCalled();
  });

  it('opens only approved external URLs outside Electron', () => {
    const { appEvents, mockElectron } = loadMainProcess({ isPackaged: false });
    const { contents, events } = createMockWebContents();

    appEvents['web-contents-created']({}, contents);

    const phoneNavigation = { preventDefault: jest.fn() };
    events['will-navigate'](phoneNavigation, 'tel:(555) 234-5678');
    expect(phoneNavigation.preventDefault).toHaveBeenCalled();
    expect(mockElectron.shell.openExternal).toHaveBeenCalledWith('tel:(555) 234-5678');

    const windowOpenHandler = contents.setWindowOpenHandler.mock.calls[0][0];
    expect(windowOpenHandler({
      url: 'https://github.com/SWEN-661-Team-3/Team_3_SWEN_661',
    })).toEqual({ action: 'deny' });
    expect(mockElectron.shell.openExternal).toHaveBeenCalledWith(
      'https://github.com/SWEN-661-Team-3/Team_3_SWEN_661',
    );
  });

  it('registers menu IPC actions and sends them to the renderer window', () => {
    const { mockElectron, mockWindowSend } = loadMainProcess();
    const menuTemplate = mockElectron.Menu.buildFromTemplate.mock.calls[0][0];

    findMenuItem(menuTemplate, 'Save Plan').click();
    findMenuItem(menuTemplate, 'CareConnect Help').click();

    expect(mockWindowSend).toHaveBeenCalledWith('menu-action', 'save');
    expect(mockWindowSend).toHaveBeenCalledWith('menu-action', 'help');
  });

  it('bridges show-help IPC events to the renderer menu action channel', () => {
    const { ipcEvents, mockWindowSend } = loadMainProcess();

    ipcEvents['show-help'](trustedIpcEvent);

    expect(mockWindowSend).toHaveBeenCalledWith('menu-action', 'help');
  });

  it('ignores show-help IPC events from untrusted senders', () => {
    const { ipcEvents, mockWindowSend } = loadMainProcess();

    ipcEvents['show-help'](untrustedIpcEvent);

    expect(mockWindowSend).not.toHaveBeenCalled();
  });

  it('does not send menu actions when the main window has been destroyed', () => {
    const { ipcEvents, mockWindow, mockWindowSend } = loadMainProcess();
    mockWindow.isDestroyed.mockReturnValue(true);

    ipcEvents['show-help'](trustedIpcEvent);

    expect(mockWindowSend).not.toHaveBeenCalled();
  });

  it('saves plan text through the save-plan-text IPC handler', async () => {
    const focusedWindow = { id: 'focused-window' };
    const { ipcHandlers, mockElectron, mockWriteFile } = loadMainProcess({
      focusedWindow,
      saveDialogResult: {
        canceled: false,
        filePath: 'C:\\Users\\CareConnect\\Documents\\todays-plan.txt',
      },
    });

    await expect(ipcHandlers['save-plan-text'](trustedIpcEvent, "Today's Plan")).resolves.toEqual({
      saved: true,
      filePath: 'C:\\Users\\CareConnect\\Documents\\todays-plan.txt',
    });

    expect(mockElectron.dialog.showSaveDialog).toHaveBeenCalledWith(focusedWindow, {
      title: "Save Today's Plan",
      defaultPath: 'C:\\Users\\CareConnect\\Documents\\todays-plan.txt',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
      ],
    });
    expect(mockWriteFile).toHaveBeenCalledWith(
      'C:\\Users\\CareConnect\\Documents\\todays-plan.txt',
      "Today's Plan",
      'utf8',
    );
  });

  it('returns a canceled result without writing a file when the save dialog is canceled', async () => {
    const { ipcHandlers, mockWriteFile } = loadMainProcess({
      saveDialogResult: { canceled: true },
    });

    await expect(ipcHandlers['save-plan-text'](trustedIpcEvent, "Today's Plan")).resolves.toEqual({
      canceled: true,
    });

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('rejects non-string save-plan-text payloads', async () => {
    const { ipcHandlers } = loadMainProcess();

    await expect(ipcHandlers['save-plan-text'](trustedIpcEvent, null)).rejects.toThrow(
      'Plan text must be a string.',
    );
  });

  it('rejects save-plan-text IPC messages from untrusted senders', async () => {
    const { ipcHandlers } = loadMainProcess();

    await expect(ipcHandlers['save-plan-text'](untrustedIpcEvent, "Today's Plan")).rejects.toThrow(
      'Blocked IPC message from untrusted sender.',
    );
  });

  it('uses the development server URL when Electron is not packaged', () => {
    const { mockLoadFile, mockLoadURL } = loadMainProcess({ isPackaged: false });

    expect(mockLoadURL).toHaveBeenCalledWith('http://localhost:5173');
    expect(mockLoadFile).not.toHaveBeenCalled();
  });

  it('creates a replacement window on activate when no windows are open', () => {
    const { appEvents, mockElectron } = loadMainProcess({ allWindows: [] });

    appEvents.activate();

    expect(mockElectron.BrowserWindow).toHaveBeenCalledTimes(2);
  });

  it('quits the app when all windows are closed on non-macOS platforms', () => {
    const { appEvents, mockElectron } = loadMainProcess();

    appEvents['window-all-closed']();

    expect(mockElectron.app.quit).toHaveBeenCalled();
  });
});
