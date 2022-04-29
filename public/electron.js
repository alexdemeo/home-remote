const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

const PROD_URL = 'http://pi4.local';
const DEV_URL = 'http://localhost:4001';

function createWindow() {
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 560,
    height: 1080,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  const url = process.env.HOME_ENV === 'development' ? DEV_URL : PROD_URL;
  console.log('Loading from:', url);
  void mainWindow.loadURL(process.env.HOME_ENV === 'development' ? DEV_URL : PROD_URL);
  mainWindow.on('closed', () => (mainWindow = null));
}

ipcMain.on('resize-electron-plz', (event, width, height) => {
  console.log('resize electron window:', width, height);
  BrowserWindow.fromWebContents(event.sender).setSize(width, height);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  if (mainWindow == null) {
    createWindow();
  }
});
