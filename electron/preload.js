const { ipcRenderer } = require('electron');

window.electronAPI = {
    onUpdateAvailable: (callback) => ipcRenderer.on('update_available', (event, ...args) => callback(event, ...args)),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', (event, ...args) => callback(event, ...args)),
    restartApp: () => ipcRenderer.send('restart_app')
};
