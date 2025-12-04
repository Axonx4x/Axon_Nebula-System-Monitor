
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const si = require('systeminformation');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false, // Frameless for the widget look
    transparent: true, // Transparent background
    hasShadow: false,
    icon: path.join(__dirname, '../public/icon.png'), // Optional: Add an icon.png to public folder
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // PRODUCTION: Load the built index.html
  // DEVELOPMENT: Load localhost
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  } else {
    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
    mainWindow.loadURL(startUrl);
    // mainWindow.webContents.openDevTools(); 
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- SYSTEM HARDWARE API BRIDGE ---

ipcMain.handle('get-system-stats', async () => {
  try {
    const [cpu, currentLoad, mem, temp] = await Promise.all([
      si.cpu(),
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature()
    ]);

    return {
      cpuUsage: currentLoad.cpus.map(c => c.load),
      cpuTemp: temp.main || 45,
      cpuName: `${cpu.manufacturer} ${cpu.brand}`,
      ram: {
        total: mem.total / 1073741824, // Bytes to GB
        used: mem.used / 1073741824,
        available: mem.available / 1073741824
      }
    };
  } catch (error) {
    console.error("Stats Error:", error);
    return null;
  }
});

ipcMain.handle('get-storage-data', async () => {
  try {
    const fsSize = await si.fsSize();
    const total = fsSize.reduce((acc, disk) => acc + disk.size, 0) / 1073741824;
    const used = fsSize.reduce((acc, disk) => acc + disk.used, 0) / 1073741824;
    
    return {
      total,
      used,
      disks: fsSize.map(d => ({
        path: d.mount,
        total: d.size / 1073741824,
        used: d.used / 1073741824,
        fs: d.type
      }))
    };
  } catch (error) {
    return null;
  }
});

// Window Controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-close', () => mainWindow?.close());
