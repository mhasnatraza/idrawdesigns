console.log('Versions:', process.versions);
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const { join } = require('path');

let autoUpdater;
try {
    const updaterPkg = require('electron-updater');
    autoUpdater = updaterPkg.autoUpdater;
} catch (e) {
    console.error('Failed to load electron-updater:', e);
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        titleBarStyle: 'hiddenInset', // Mac-style seamless titlebar
        trafficLightPosition: { x: 12, y: 12 },
        webPreferences: {
            preload: join(__dirname, 'preload.cjs'),
            nodeIntegration: false,       // ✅ SECURITY: Disable Node in renderer
            contextIsolation: true,       // ✅ SECURITY: Enable isolation
            webSecurity: true,            // ✅ SECURITY: Enable web security
            sandbox: true                 // ✅ SECURITY: Add sandboxing
        },
        backgroundColor: '#0f172a',
        title: "i Draw Design"
    });

    const isDev = process.env.NODE_ENV === 'development';
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${join(__dirname, '../dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    // if (isDev) {
    mainWindow.webContents.openDevTools();
    // }
}

app.whenReady().then(() => {
    createWindow();

    // Check for updates immediately on start
    if (autoUpdater) {
        autoUpdater.checkForUpdatesAndNotify().catch(e => console.error('Update check failed:', e));
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Auto-updater events
if (autoUpdater) {
    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update_downloaded');
    });
}

ipcMain.on('restart_app', () => {
    if (autoUpdater) {
        autoUpdater.quitAndInstall();
    }
});
