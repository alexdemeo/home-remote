const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

const PROD_URL = 'http://pi4.local';
const DEV_URL = 'http://localhost:4001';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 1080,
    frame: false,
  });
  const url = process.env.HOME_ENV === 'development' ? DEV_URL : PROD_URL;
  console.log('Loading from:', url);
  mainWindow.loadURL(process.env.HOME_ENV === 'development' ? DEV_URL : PROD_URL);
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
