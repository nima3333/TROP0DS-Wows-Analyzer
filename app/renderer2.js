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
        if(key_area.value != ""){
            getGlobal('sharedObj').noKey = false;    
            getGlobal('sharedObj').key = key_area.value;
            save_dict(getGlobal('sharedObj'));
            make_green(key_area);
            if(getGlobal('sharedObj').noPath == false){
                remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
            }
        }
        else{
            make_red(key_area);
        }
    })

    pathzone = document.getElementById('path')
    curpath = document.getElementById('curpath')
    curpath.innerText = "Chemin courant : " + getGlobal('sharedObj')['path']
    pathzone.onchange = function() {
        getGlobal('sharedObj').noPath = false;    
        getGlobal('sharedObj').path = pathzone.files[0].path;
        curpath.innerText = "Chemin courant : " + getGlobal('sharedObj')['path']
        save_dict(getGlobal('sharedObj'));
        console.dir(pathzone)
        if(getGlobal('sharedObj').noKey === false){
            remote.getCurrentWindow().loadURL(path.join('file://', __dirname, 'index.html'));
        }
    };
}
  
var reload = ()=>{
    getCurrentWindow().reload()
}

var save_dict = (dictstring)=>{
    var dictstring = JSON.stringify(dictstring);
    fs.writeFile("config.json", dictstring, function(err, result) {
        if(err) console.log('error', err);
    });    

    fs.writeFile("config.json", dictstring, function(err, result) {
        if(err) console.log('error', err);
    });
}

var make_red = (area) => {
    area.classList.add("is-invalid");
    area.classList.remove("is-valid");
}

var make_green = (area) => {
    area.classList.add("is-valid");
    area.classList.remove("is-invalid");
}