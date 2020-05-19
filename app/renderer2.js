const path = require('path')
const {getCurrentWindow, globalShortcut, getGlobal} = require('electron').remote;
const { remote } = require('electron')
const fs = require('fs');

let reload_button;

window.onload = function() {
    let to_hide = getGlobal('sharedObj').noKey
    reload_button = document.getElementById('retour')
    reload_button.disabled = to_hide

    reload_button.addEventListener('click', () => {
        remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
    })
    save_button = document.getElementById('save')
    key_area = document.getElementById('inputKey')

    save_button.addEventListener('click', () => {
        this.console.dir(key_area.value)
        dict = {"key" : btoa(key_area.value)}
        var dictstring = JSON.stringify(dict);
        fs.writeFile("config.json", dictstring, function(err, result) {
            if(err) console.log('error', err);
        });    
        getGlobal('sharedObj').noKey = true;    
        getGlobal('sharedObj').key = key_area.value;   
        remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
    })
}
  
var reload = ()=>{
    getCurrentWindow().reload()
}
