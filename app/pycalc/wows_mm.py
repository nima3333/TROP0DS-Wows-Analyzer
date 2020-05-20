import requests
import json
import re
import config

def get_html(api_key, path):
    key = api_key

    def fct_color(wr):
        if wr < 45:
            return "text-white bg-danger"
        elif wr < 55:
            return "text-white bg-warning"
        else:
            return "text-white bg-success"

    with open(f'{path}/test.json', 'r') as f:
        distros_dict = json.load(f)

    players = []
    names = []
    shipids = []
    for player in distros_dict["vehicles"]:
        shipid = str(player["shipId"])
        relation = player["relation"]
        id = player["id"]
        name = player["name"]
        names.append(name)
        shipids.append(shipid)
        players.append([shipid, relation, name])

    requestable_names = "%2C".join(names)
    r = requests.get(f'https://api.worldofwarships.eu/wows/account/list/?search={requestable_names}&application_id={key}&type=exact')
    result = json.loads(r.content.decode('utf-8'))
    raw_data = result["data"]
    name_dictionary = {}
    for element in raw_data:
        name_dictionary[element["nickname"]] = element["account_id"]

    requestable_ships = "%2C".join(shipids)
    r = requests.get(f'https://api.worldofwarships.eu/wows/encyclopedia/ships/?application_id={key}&fields=name%2Cdefault_profile.artillery.shells%2Ctype%2Cimages.contour&ship_id={requestable_ships}')
    result = json.loads(r.content.decode('utf-8'))
    ships_dictionary = result["data"]

    for player in players:
        player.append(ships_dictionary[player[0]]["type"])

    players.sort(key = lambda x: x[3])

    a=1
    b=1

    left = []
    right = []

    for player in players:
        hidden = False

        #General data about the player
        r = requests.get(f'https://api.worldofwarships.eu/wows/account/statsbydate/?application_id={key}&account_id={name_dictionary[player[2]]}&fields=pvp.xp%2C+pvp.battles%2C+pvp.wins')
        result = json.loads(r.content.decode('utf-8'))
        if (result["meta"]["hidden"] is not None):        
            text = f"{player[2]} <br> Hidden"
            hidden = True
        else:
            raw_general_data = result["data"][str(name_dictionary[player[2]])]["pvp"]
            raw_general_data = raw_general_data[next(iter(raw_general_data))]
            wins = raw_general_data["wins"]
            xp = raw_general_data["xp"]
            battles = raw_general_data["battles"]
            text = f"{player[2]}     <br>  Wr={wins/battles*100 :.2f}% | XP={xp/battles :.0f} | NbB={battles}"

        #shipname & artillery
        ship_name = ships_dictionary[player[0]]["name"]
        if ships_dictionary[player[0]]["default_profile"]["artillery"] is None:
            #CV
            text2 = f"{ship_name}"
        else:
            ship_caliber = ships_dictionary[player[0]]["default_profile"]["artillery"]["shells"]["AP"]["name"]
            matcher = re.match(r"^(\d{3})", ship_caliber)
            if not matcher:
                text2 = f"{ship_name}"
            else:
                actual_caliber = matcher.group(0)
                if int(actual_caliber) > 380:
                    text2 = f"{ship_name} (AP : {actual_caliber}mm) 💀"
                else:
                    text2 = f"{ship_name} (AP : {actual_caliber}mm)"

        #details about the ship
        if not hidden:
            r = requests.get(f'https://api.worldofwarships.eu/wows/ships/stats/?application_id={key}&account_id={name_dictionary[player[2]]}&ship_id={player[0]}&fields=pvp.xp%2C+pvp.battles%2C+pvp.wins')
            result = json.loads(r.content.decode('utf-8'))
            raw_specific_data = result["data"][str(name_dictionary[player[2]])][0]["pvp"]
            wins_s = raw_specific_data["wins"]
            xp_s = raw_specific_data["xp"]
            battles_s = raw_specific_data["battles"]
            text2 += f"<br> Wr={wins_s/battles_s*100 :.2f}% | XP={xp_s/battles_s :.0f} | NbB={battles_s}"

        if hidden or battles_s==0:
            color = "text-white bg-secondary"
        else:
            total_bat = battles_s + battles
            mean_wr = (battles * (wins/battles*100) + battles_s * (wins_s/battles_s*100))/total_bat
            color = fct_color(mean_wr)

        # a, b compteurs
        if player[1]==0:
            i=13
            left.append((text, text2, ships_dictionary[player[0]]["images"]["contour"], "text-white bg-info"))
        elif player[1]==1:
            i=a
            a+=1
            left.append((text, text2, ships_dictionary[player[0]]["images"]["contour"], color))
        elif player[1]==2:
            i=b
            b+=1
            right.append((text, text2, ships_dictionary[player[0]]["images"]["contour"], color))

    str_left = ""
    for l in left:
        str_left += f"""
            <div class="row no-gutters">
            <div class="col-md-2" style="padding-top: 10px; padding-bottom: 10px">
                <img src='{l[2]}' class="card-img" alt="..." style="width:150px; height: auto; padding-right: 20px">
            </div>
            <div class="col-md-9" style="position: relative">
                <div class="card {l[3]}" style="width: inherit; height:auto;">
                <div class="card-body" style="padding-top:0px; padding-bottom:0px">
                    <div class="row card-text" style="padding: 0px; ">
                        <div class="col" style="padding: 0px">
                            {l[0]}
                        </div>
                        <div class="col" style="padding: 0px">
                            {l[1]}
                        </div>
                    </div>
                </div> 
                </div>
            </div>
            </div>
            """
            
    

    str_right = ""
    for l in right:
        str_right += f"""
            <div class="row no-gutters">
            <div class="col-md-9" style="position: relative">
                <div class="card {l[3]}" style="width: inherit; height:auto;">
                <div class="card-body" style="padding-top:0px; padding-bottom:0px">
                    <div class="row card-text" style="padding: 0px; ">
                        <div class="col" style="padding: 0px">
                            {l[0]}
                        </div>
                        <div class="col" style="padding: 0px">
                            {l[1]}
                        </div>
                    </div>
                </div> 
                </div>
            </div>
            <div class="col-md-2" style="padding-top: 10px; padding-bottom: 10px">
                <img src='{l[2]}' class="card-img" alt="..." style="width:150px; height: auto; padding-left: 20px">
            </div>

            </div>
            """
    
    return (str_left, str_right)
