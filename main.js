const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const Menu = electron.Menu
const fs = require('fs');

let mainWindow = null

const menuTemplate = [
  {
      label: 'Fichier',
      submenu: [
          {
              label: 'Paramètres',
              click(){
                mainWindow.loadURL(path.join('file://', __dirname, 'key.html'));
              }
          },
          {
              label: 'Quitter',
              click(){
                  app.quit();
              }
          }
      ]
  }
];
const createWindow = () => {
  mainWindow = new BrowserWindow(
    {width: 1200, 
    height: 800,
    webPreferences: {
      nodeIntegration: true
    },
    title: "TROPODS"
  })
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  return mainWindow
}

app.on('ready', () => {
  mainWindow = createWindow()
  mainWindow.loadURL(path.join('file://', __dirname, 'key.html'));
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  global.sharedObj = {};
  fs.readFile(`config.json`, (err, jsonString) => {
    if (err) {
        console.log('does not exist')
        global.sharedObj["noKey"] = true;
        global.sharedObj["noPath"] = true;
        global.sharedObj['key'] = "";
        global.sharedObj['path'] = "";
        mainWindow.loadURL(path.join('file://', __dirname, 'key.html'));
      } else {
        const customer = JSON.parse(jsonString)
        global.sharedObj['key'] = (customer["key"]);
        global.sharedObj["noKey"] = false;
        global.sharedObj['path'] = (customer["path"]);
        global.sharedObj["noPath"] = false; 
        mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
      }
  })
  
});

app.on('window-all-closed', () => {
    app.quit()
})

