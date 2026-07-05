describe('preload IPC bridge', () => {
  let mockExposeInMainWorld;
  let mockIpcRenderer;
  let bridge;

  beforeEach(() => {
    jest.resetModules();
    mockExposeInMainWorld = jest.fn();
    mockIpcRenderer = {
      invoke: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    jest.doMock('electron', () => ({
      contextBridge: {
        exposeInMainWorld: mockExposeInMainWorld,
      },
      ipcRenderer: mockIpcRenderer,
    }));

    require('../../preload');
    bridge = mockExposeInMainWorld.mock.calls[0][1];
  });

  afterEach(() => {
    jest.dontMock('electron');
  });

  it('exposes the CareConnect API in the isolated renderer world', () => {
    expect(mockExposeInMainWorld).toHaveBeenCalledWith('careConnect', {
      onMenuAction: expect.any(Function),
      savePlanText: expect.any(Function),
    });
  });

  it('subscribes to menu actions and removes the same IPC listener on cleanup', () => {
    const callback = jest.fn();

    const cleanup = bridge.onMenuAction(callback);

    expect(mockIpcRenderer.on).toHaveBeenCalledWith('menu-action', expect.any(Function));
    const listener = mockIpcRenderer.on.mock.calls[0][1];

    listener({ sender: 'main' }, 'search');
    expect(callback).toHaveBeenCalledWith('search');

    cleanup();
    expect(mockIpcRenderer.removeListener).toHaveBeenCalledWith('menu-action', listener);
  });

  it('invokes the save-plan-text IPC handler with the plan payload', () => {
    const result = Promise.resolve({ saved: true, filePath: 'todays-plan.txt' });
    mockIpcRenderer.invoke.mockReturnValue(result);

    expect(bridge.savePlanText("Today's Plan")).toBe(result);
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('save-plan-text', "Today's Plan");
  });
});
