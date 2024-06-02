const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  createTab: (url) => ipcRenderer.send('create-tab', url),
  navigate: (tabId, url) => ipcRenderer.send('navigate', { tabId, url }),
  tabAction: (tabId, action) => ipcRenderer.send('tab-action', { tabId, action }),
  onTabCreated: (callback) => ipcRenderer.on('tab-created', (event, tabId, url) => callback(tabId, url))
});