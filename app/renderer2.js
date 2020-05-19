const path = require('path')
const {getCurrentWindow, globalShortcut, getGlobal} = require('electron').remote;
const { remote } = require('electron')
const fs = require('fs');

let reload_button;

window.onload = function() {
    let to_hide = getGlobal('sharedObj').noKey & getGlobal('sharedObj').noPath

    reload_button = document.getElementById('retour')
    reload_button.disabled = to_hide

    reload_button.addEventListener('click', () => {
        remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
    })

    save_button = document.getElementById('save')
    key_area = document.getElementById('inputKey')
    key_area.value = getGlobal('sharedObj')['key']
    save_button.addEventListener('click', () => {
        this.console.dir(key_area.value)
        dict = {"key" : btoa(key_area.value)}
        var dictstring = JSON.stringify(dict);
        fs.writeFile("config.json", dictstring, function(err, result) {
            if(err) console.log('error', err);
        });    
        getGlobal('sharedObj').noKey = true;    
        getGlobal('sharedObj').key = key_area.value;   
        if(getGlobal('sharedObj').noPath == false){
            remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
        }
    })

    pathzone = document.getElementById('path')
    this.console.dir(pathzone)
    pathzone.onchange = function() {
        console.dir(pathzone.value)
    };
    pathzone.addEventListener('onchange', () => {
        console.dir(pathzone.value)
        
    })
}
  
var reload = ()=>{
    getCurrentWindow().reload()
}
