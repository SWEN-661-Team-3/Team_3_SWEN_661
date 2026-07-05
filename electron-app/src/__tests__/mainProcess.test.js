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

  const mockWindow = {
    isDestroyed: jest.fn(() => false),
    loadFile: mockLoadFile,
    loadURL: mockLoadURL,
    webContents: {
      send: mockWindowSend,
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
    mockWriteFile,
  };
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

    ipcEvents['show-help']();

    expect(mockWindowSend).toHaveBeenCalledWith('menu-action', 'help');
  });

  it('does not send menu actions when the main window has been destroyed', () => {
    const { ipcEvents, mockWindow, mockWindowSend } = loadMainProcess();
    mockWindow.isDestroyed.mockReturnValue(true);

    ipcEvents['show-help']();

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

    await expect(ipcHandlers['save-plan-text']({}, "Today's Plan")).resolves.toEqual({
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

    await expect(ipcHandlers['save-plan-text']({}, "Today's Plan")).resolves.toEqual({
      canceled: true,
    });

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('rejects non-string save-plan-text payloads', async () => {
    const { ipcHandlers } = loadMainProcess();

    await expect(ipcHandlers['save-plan-text']({}, null)).rejects.toThrow(
      'Plan text must be a string.',
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
