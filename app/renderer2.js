const path = require('path')
const {getCurrentWindow, globalShortcut, getGlobal} = require('electron').remote;
const { remote } = require('electron')
const fs = require('fs');

let reload_button;

window.onload = function() {
    dict = {}
    fs.readFile(`config.json`, (err, jsonString) => {
        if (err) {
            console.log('does not exist')
          } else {
            const customer = JSON.parse(jsonString)
            dict = customer          
        }
    })

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
        if(key_area.value != ""){
            dict = {"key" : (key_area.value)}
            var dictstring = JSON.stringify(dict);
            fs.writeFile("config.json", dictstring, function(err, result) {
                if(err) console.log('error', err);
            });    
            getGlobal('sharedObj').noKey = false;    
            getGlobal('sharedObj').key = key_area.value;
            key_area.classList.add("is-valid");
            key_area.classList.remove("is-invalid");
            if(getGlobal('sharedObj').noPath == false){
                remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
            }
        }
        else{
            key_area.classList.add("is-invalid");
            key_area.classList.remove("is-valid");
        }
    })

    pathzone = document.getElementById('path')
    this.console.dir(pathzone)
    pathzone.onchange = function() {
        console.dir(pathzone.value)
        getGlobal('sharedObj').noPath = false;    
        getGlobal('sharedObj').path = pathzone.value;
        if(getGlobal('sharedObj').noKey === false){
            remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
        }
    };
    pathzone.addEventListener('onchange', () => {
        console.dir(pathzone.value)
        
    })
}
  
var reload = ()=>{
    getCurrentWindow().reload()
}
