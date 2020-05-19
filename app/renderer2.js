const path = require('path')
const {getCurrentWindow, globalShortcut} = require('electron').remote;
const { remote } = require('electron')

let reload_button;

window.onload = function() {
    reload_button = document.getElementById('retour')
    
    reload_button.addEventListener('click', () => {
        remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
    })
}
  
var reload = ()=>{
    getCurrentWindow().reload()
}
