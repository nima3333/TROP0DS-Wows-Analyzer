const {getCurrentWindow, globalShortcut, getGlobal} = require('electron').remote;
const path = require('path')
const axios = require('axios');
const fs = require('fs');
//const zerorpc = require("zerorpc")

/* let client = new zerorpc.Client()
console.log("renderer is here")
client.connect("tcp://127.0.0.1:4242")
 */
document.body.innerHTML = `<div class="jumbotron text-center" style="padding: 0">
<h1>Nima's Wows Analyser</h1>
</div>
<div>
<div class="spinner-border" role="status" style="display: block; position: fixed; z-index: 1031; top: 50%; right: 50%; margin-top: -..px; margin-right: -..px;">
<span class="sr-only">Loading...</span>
</div>
</div>`

let reload_button;

var request_function = (link) => {
  var res = request('GET', link);
  return(res.getBody());
}


var reload = ()=>{
  getCurrentWindow().reload()
}

window.onload = function() {
  //let true_path = path.join(getGlobal('sharedObj').path, 'replays')
  let true_path = getGlobal('sharedObj').path
  let dict_to_transfer = {path: true_path, key: getGlobal('sharedObj').key}
  dict_to_transfer = JSON.stringify(dict_to_transfer)
  var aa = api()
/*   client.invoke("echo", dict_to_transfer, (error, res) => {
    if(error) {
    } else {
      var doc = new DOMParser().parseFromString(res, "text/xml");
      document.body.innerHTML = res
      reload_button = document.getElementById('myBtn')
  
      reload_button.addEventListener('click', () => {
        reload()
      })
    }
  }) */
}

function api () {
  key = getGlobal('sharedObj').key;
  pathh = getGlobal('sharedObj').path;
  if(!(fs.existsSync(pathh)) || key===""){
    return (`<div class="jumbotron text-center" style="padding: 0">
                  <h1>Nima's Wows Analyser</h1>
              </div>
              <div class="alert alert-danger" role="alert" style="text-align: center;">
                  The wows directory does not exist
              </div>
              </div>`);
  }
  if(!fs.existsSync(path.join(pathh, "test.json"))) {
    return(`<div class=\"jumbotron text-center\" style="padding: 0">
                  <h1>Nima's Wows Analyser</h1>
              </div>
              <div>
                  <div class="jumbotron jumbotron-fluid">
                      <div class="container">
                          <p class="lead">The key is loaded, but no game is detected yet.</p>
                          <button id="myBtn" type="button" class="btn btn-secondary">Reload</button>
                          <div class="spinner-border" role="status" style="display: block; position: fixed; z-index: 1031; top: 50%; right: 50%; margin-top: -..px; margin-right: -..px;">
                          <span class="sr-only">Loading...</span>
                          </div>
                      </div>
                  </div>
              </div>`);
  }
  var stra = get_html(key, pathh)
    console.dir("stra")
    console.dir(stra)
    return `<div class="jumbotron text-center" style="padding: 0">
                      <h1>Nima's Wows Analyser</h1>
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
  var distro_dict = fs.readFileSync(path.join(pathh, "test.json"))
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
  result2.open('GET', `https://api.worldofwarships.eu/wows/account/list/?search=${requestable_names}&application_id=${key}&type=exact`, false);  // `false` makes the request synchronous
  result2.send(null);
  result2 = JSON.parse(result2.responseText)
  result2 = result2["data"]
  console.dir(result2)
  var name_dictionary = {}
  for (const element of result2) {
    name_dictionary[element["nickname"]] = element["account_id"]
  }
  console.dir("name_dictionary")
  console.dir(name_dictionary)
  return ['e', "e"]
}

var fct_color = (wr) =>{
  if (wr < 45)
  return "text-white bg-danger";
  else if(wr < 55)
  return "text-white bg-warning";
  else
  return "text-white bg-success";
}

