const {getCurrentWindow, getGlobal} = require('electron').remote;
const path = require('path')
const fs = require('fs');

let reload_button;

var request_function = (link) => {
  var result3 = new XMLHttpRequest();
  result3.open('GET', link, false);
  result3.send(null);
  return JSON.parse(result3.responseText)
}

var reload = ()=>{
  getCurrentWindow().reload()
}

window.onload = function() {
  document.body.innerHTML = `<div class="jumbotron text-center" style="padding: 0">
    <h1>sTRategic bOat Pr0bing and Dodging System</h1>
    </div>
    <div>
    <ul class="list-group">
      <li class="list-group-item list-group-item-success">✅ Recherche du répertoire</li>
      <li class="list-group-item list-group-item-success">✅ Vérification du répertoire</li>
      <li class="list-group-item list-group-item-success">✅ Vérification de la clé</li>
      <li class="list-group-item list-group-item-success">✅ Recherche de la partie en cours</li>
      <li class="list-group-item list-group-item-warning">⌛ Chargment des données</li>
    </ul>

    <div class="spinner-border" role="status" style="display: block; top: 50%; right: 50%; margin: auto; margin-top: 20px">
    <span class="sr-only">Loading...</span>
    </div>
    </div>`
    this.setTimeout(function() {
      let dict_to_transfer = {path: getGlobal('sharedObj').path, key: getGlobal('sharedObj').key}
      dict_to_transfer = JSON.stringify(dict_to_transfer)
      var aa = api()
      document.body.innerHTML = aa
      reload_button = document.getElementById('myBtn')
      
      reload_button.addEventListener('click', () => {
        reload()
      })
    }, 10);
}

function api () {
  key = getGlobal('sharedObj').key;
  pathh = getGlobal('sharedObj').path;
  if(!(fs.existsSync(pathh))){
    return (`<div class="jumbotron text-center" style="padding: 0">
                  <h1>sTRategic bOat Pr0bing and Dodging System</h1>
              </div>
              <ul class="list-group">
                <li class="list-group-item list-group-item-danger">❌Le répertoire indiqué est introuvable</li>
                <li class="list-group-item disabled">Vérification du répertoire</li>
                <li class="list-group-item disabled">Vérification de la clé</li>
                <li class="list-group-item disabled">Recherche de la partie en cours</li>
                <li class="list-group-item disabled">Chargment des données</li>
              </ul>
              </div>`);
  }
  if(!(fs.existsSync(path.join(pathh, "replays")))){
    return (`<div class="jumbotron text-center" style="padding: 0">
                  <h1>sTRategic bOat Pr0bing and Dodging System</h1>
              </div>
              <ul class="list-group">
                <li class="list-group-item list-group-item-success">✅ Recherche du répertoire</li>
                <li class="list-group-item list-group-item-danger">❌ Le répertoire indiqué n'est pas celui du jeu</li>
                <li class="list-group-item disabled">Vérification de la clé</li>
                <li class="list-group-item disabled">Recherche de la partie en cours</li>
                <li class="list-group-item disabled">Chargment des données</li>
              </ul>
              </div>`);
  }
  pathh = path.join(pathh, "replays")
  var test = request_function(`https://api.worldoftanks.eu/wgn/servers/info/?application_id=${key}`)
  if(test["status"] !== "ok" || key===""){
    return (`<div class="jumbotron text-center" style="padding: 0">
    <h1>sTRategic bOat Pr0bing and Dodging System</h1>
    </div>
    <ul class="list-group">
      <li class="list-group-item list-group-item-success">✅ Recherche du répertoire</li>
      <li class="list-group-item list-group-item-success">✅ Vérification du répertoire</li>
      <li class="list-group-item list-group-item-danger">❌ La clé indiquée n'est pas valide</li>
      <li class="list-group-item disabled">Recherche de la partie en cours</li>
      <li class="list-group-item disabled">Chargment des données</li>
    </ul>
    </div>`);
  }

  if(!fs.existsSync(path.join(pathh, "tempArenaInfo.json"))) {
    return(`<div class=\"jumbotron text-center\" style="padding: 0">
                  <h1>sTRategic bOat Pr0bing and Dodging System</h1>
              </div>
              <div>
                  <div class="jumbotron jumbotron-fluid">
                      <div class="container">
                          <ul class="list-group">
                            <li class="list-group-item list-group-item-success">✅ Recherche du répertoire</li>
                            <li class="list-group-item list-group-item-success">✅ Vérification du répertoire</li>
                            <li class="list-group-item list-group-item-success">✅ Vérification de la clé</li>
                            <li class="list-group-item list-group-item-warning">⌛ Recherche de la partie en cours</li>
                            <li class="list-group-item disabled">Chargment des données</li>
                          </ul>
                          <button id="myBtn" type="button" class="btn btn-secondary" style="margin: auto; display:block; margin-top: 20px; margin-bottom: 20px">Reload</button>
                          </div>
                          <div class="spinner-border" role="status" style="display: block; top: 50%; right: 50%; margin: auto">
                          <span class="sr-only">Loading...</span>

                      </div>
                  </div>
              </div>`);
  }
  var stra = get_html(key, pathh)
  return `<div class="jumbotron text-center" style="padding: 0">
                    <h1>sTRategic bOat Pr0bing and Dodging System</h1>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        ${stra[0]}
                    </div>
                    <div class="col-sm-6">
                        ${stra[1]}
                    </div>
                    <div style="margin:auto">
                        <button id="myBtn" type="button" class="btn btn-secondary btn-lg btn-block">Reload</button>
                    </div>
                </div>`


}

function get_html(key, pathh) {
  var distro_dict = fs.readFileSync(path.join(pathh, "tempArenaInfo.json"))
  json_dict = JSON.parse(distro_dict)
  var players = []
  var names = []
  var shipids = []
  for (const player of json_dict["vehicles"]) {
    var shipid = player["shipId"].toString()
    var relation = player["relation"]
    var id = player["id"]
    var name = player["name"]
    names.push(name)
    shipids.push(shipid)
    players.push([shipid, relation, name])
  }
  var requestable_names = names.join("%2C")
  var result2 = new XMLHttpRequest();
  result2.open('GET', `https://api.worldofwarships.eu/wows/account/list/?search=${requestable_names}&application_id=${key}&type=exact`, false);  
  result2.send(null);
  result2 = JSON.parse(result2.responseText)
  result2 = result2["data"]
  var name_dictionary = {}
  for (const element of result2) {
    name_dictionary[element["nickname"]] = element["account_id"]
  }

  var requestable_ships = shipids.join("%2C")
  var result3 = new XMLHttpRequest();
  result3.open('GET', `https://api.worldofwarships.eu/wows/encyclopedia/ships/?application_id=${key}&fields=name%2Cdefault_profile.artillery.shells%2Ctype%2Cimages.contour&ship_id=${requestable_ships}`, false);
  result3.send(null);
  result3 = JSON.parse(result3.responseText)
  var ships_dictionary = result3["data"]
  for (const player of players) {
    player.push(ships_dictionary[player[0]]["type"])
  }
  players.sort(function(a, b) {
    if(a[3] > b[3]) return 1;
    if(a[3] < b[3]) return -1;
    return 0;
  });

  var a=1
  var b=1

  var left = []
  var right = []

  for (const player of players) {
    var hidden = false
    //General data about the player
    var result = request_function(`https://api.worldofwarships.eu/wows/account/statsbydate/?application_id=${key}&account_id=${name_dictionary[player[2]]}&fields=pvp.xp%2C+pvp.battles%2C+pvp.wins`)
    var text = ""
    if (result["meta"]["hidden"]){
      text = `${player[2]} <br> Hidden`
      hidden = true
    }        
    else{
      var raw_general_data = result["data"][name_dictionary[player[2]]]["pvp"]
      raw_general_data = raw_general_data[Object.keys(raw_general_data)[0]]
      var wins = raw_general_data["wins"]
      var xp = raw_general_data["xp"]
      var battles = raw_general_data["battles"]
      text = `${player[2]}     <br>  Wr=${(wins/battles*100).toFixed(2)}% | XP=${(xp/battles).toFixed(2)} | NbB=${battles}`
    }

    //shipname & artillery
    ship_name = ships_dictionary[player[0]]["name"]
    var text2 = ship_name

    //details about the ship
    if(!hidden){
      var result = request_function(`https://api.worldofwarships.eu/wows/ships/stats/?application_id=${key}&account_id=${name_dictionary[player[2]]}&ship_id=${player[0]}&fields=pvp.xp%2C+pvp.battles%2C+pvp.wins`)
      try{
        var raw_specific_data = result["data"][name_dictionary[player[2]]][0]["pvp"]
        var battles_s = raw_specific_data["battles"]
        var wins_s = raw_specific_data["wins"]
        var xp_s = raw_specific_data["xp"]
        text2 += `<br> Wr=${(wins_s/battles_s*100).toFixed(2)}% | XP=${(xp_s/battles_s).toFixed(2)} | NbB=${battles_s}`  
      }
      catch (error) {
        hidden=true
      }
    }
    var color
    if (hidden || battles_s==0){
      color = "text-white bg-secondary"
    }
    else{
      var total_bat = battles_s + battles
      var mean_wr = (battles * (wins/battles*100) + battles_s * (wins_s/battles_s*100))/total_bat
      color = fct_color(mean_wr)
    }
    //a, b compteurs
    if( player[1]==0){
      i=13
      left.push([text, text2, ships_dictionary[player[0]]["images"]["contour"], "text-white bg-info"])
    }
    else if (player[1]==1){
      i=a
      a+=1
      left.push([text, text2, ships_dictionary[player[0]]["images"]["contour"], color])
    }
    else if (player[1]==2){
      i=b
      b+=1
      right.push([text, text2, ships_dictionary[player[0]]["images"]["contour"], color])
    }
  }
  var str_left = ""
  for (const l of left){
    str_left += `
    <div class="row no-gutters">
    <div class="col-md-2" style="padding-top: 10px; padding-bottom: 10px">
        <img src='${l[2]}' class="card-img" alt="..." style="width:150px; height: auto; padding-right: 20px">
    </div>
    <div class="col-md-9" style="position: relative">
        <div class="card ${l[3]}" style="width: inherit; height:auto;">
        <div class="card-body" style="padding-top:0px; padding-bottom:0px">
            <div class="row card-text" style="padding: 0px; ">
                <div class="col" style="padding: 0px">
                    ${l[0]}
                </div>
                <div class="col" style="padding: 0px">
                    ${l[1]}
                </div>
            </div>
        </div> 
        </div>
    </div>
    </div>
    `
  }

  var str_right = ""
  for (const l of right){
    str_right +=  `
          <div class="row no-gutters">
          <div class="col-md-9" style="position: relative">
              <div class="card ${l[3]}" style="width: inherit; height:auto;">
              <div class="card-body" style="padding-top:0px; padding-bottom:0px">
                  <div class="row card-text" style="padding: 0px; ">
                      <div class="col" style="padding: 0px">
                          ${l[0]}
                      </div>
                      <div class="col" style="padding: 0px">
                          ${l[1]}
                      </div>
                  </div>
              </div> 
              </div>
          </div>
          <div class="col-md-2" style="padding-top: 10px; padding-bottom: 10px">
              <img src='${l[2]}' class="card-img" alt="..." style="width:150px; height: auto; padding-left: 20px">
          </div>

          </div>
          `
  }

  return [str_left, str_right]
}

var fct_color = (wr) =>{
  if (wr < 45)
  return "text-white bg-danger";
  else if(wr < 55)
  return "text-white bg-warning";
  else
  return "text-white bg-success";
}

