import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        titleBarStyle: 'hiddenInset', // Mac-style seamless titlebar
        trafficLightPosition: { x: 12, y: 12 },
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false, // Simplifying for local agent tools integration if needed later
            webSecurity: false // Often helpful for local file loading in these prototype apps
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
    autoUpdater.checkForUpdatesAndNotify();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Auto-updater events
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
