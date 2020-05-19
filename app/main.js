const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const Menu = electron.Menu
const { dialog } = require('electron')
const fs = require('fs');
const atob = require("atob");

/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'pycalcdist'
const PY_FOLDER = 'pycalc'
const PY_MODULE = 'api' // without .py suffix

let pyProc = null
let pyPort = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const selectPort = () => {
  pyPort = 4242
  return pyPort
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()

  if (guessPackaged()) {
    pyProc = require('child_process').execFile(script, [port])
  } else {
    pyProc = require('child_process').spawn('python3', [script, port])
  }
 
  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


/*************************************************************
 * window management
 *************************************************************/

let mainWindow = null

const menuTemplate = [
  {},
  {
      label: 'File',
      submenu: [
          {
              label: 'Load API Key',
              click(){
                mainWindow.loadURL(path.join('file://', __dirname, 'key.html'));
              }
          },
          {
              label: 'Quit',
              click(){
                  app.quit();
              }
          }
      ]
  }
];
const createWindow = () => {
  mainWindow = new BrowserWindow({width: 1200, height: 800})
  /**  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'key.html'),
    protocol: 'file:',
    slashes: true
  }))**/
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  return mainWindow
}

app.on('ready', () => {
  mainWindow = createWindow()
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
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
      }
  })
  
});

app.on('window-all-closed', () => {
    app.quit()
})

