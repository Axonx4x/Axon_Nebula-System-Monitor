
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('axonAPI', {
  getStats: () => ipcRenderer.invoke('get-system-stats'),
  getStorage: () => ipcRenderer.invoke('get-storage-data'),
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  platform: process.platform
});
