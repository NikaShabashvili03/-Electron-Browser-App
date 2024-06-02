const { app, BrowserWindow, ipcMain, BrowserView } = require('electron');
const path = require('path');

let mainWindow;
let tabs = [];
let tabId = 1;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('resize', () => {
    tabs.forEach(tab => {
      const mainWindowBounds = mainWindow.getBounds();
      tab.view.setBounds({ x: 0, y: 100, width: mainWindowBounds.width, height: mainWindowBounds.height - 50 });
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      window.electron.createTab("https://google.com");
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('create-tab', (event, url) => {
  const tab = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  });

  if(!url.includes("https://")){
    url = `https://www.google.com/search?q=${url}`
  }
  
  mainWindow.addBrowserView(tab);
  updateTabBounds(tab);
  tab.webContents.loadURL(url);
  tabs.push({ id: tabId, view: tab });
  mainWindow.webContents.send('tab-created', tabId, url);
  tabId++;
});

ipcMain.on('navigate', (event, { tabId, url }) => {
  const tab = tabs.find(tab => tab.id === tabId);
  if (tab) {
    tab.view.webContents.loadURL(url);
  }
});

ipcMain.on('tab-action', (event, { tabId, action }) => {
  const tab = tabs.find(tab => tab.id === tabId);
  if (tab) {
    if (action === 'back') {
      tab.view.webContents.goBack();
    } else if (action === 'forward') {
      tab.view.webContents.goForward();
    } else if (action === 'reload') {
      tab.view.webContents.reload();
    }
  }
});

function updateTabBounds(tab) {
  const mainWindowBounds = mainWindow.getBounds();
  tab.setBounds({ x: 0, y: 100, width: mainWindowBounds.width, height: mainWindowBounds.height - 50 });
}