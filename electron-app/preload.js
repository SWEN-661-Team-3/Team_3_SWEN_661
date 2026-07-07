const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('careConnect', {
  onMenuAction: (callback) => {
    const listener = (_event, action) => callback(action);
    ipcRenderer.on('menu-action', listener);
    return () => ipcRenderer.removeListener('menu-action', listener);
  },
  savePlanText: (planText) => ipcRenderer.invoke('save-plan-text', planText),
});
