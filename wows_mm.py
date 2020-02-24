import requests
import json
import re
from tkinter import *
import config

key = config.api_key
master = Tk()

def fct_color(wr):
    if wr < 45:
        return "red"
    elif wr < 50:
        return "orange"
    elif wr < 55:
        return "green"
    else:
        return "purple"

with open('test.json', 'r') as f:
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
for player in players:
    hidden = False
    # a, b compteurs
    if player[1]==0:
        i=13
        column = 0
    elif player[1]==1:
        i=a
        a+=1
        column = 0
    elif player[1]==2:
        i=b
        b+=1
        column = 1

    #General data about the player
    r = requests.get(f'https://api.worldofwarships.eu/wows/account/statsbydate/?application_id={key}&account_id={name_dictionary[player[2]]}&fields=pvp.xp%2C+pvp.battles%2C+pvp.wins')
    result = json.loads(r.content.decode('utf-8'))
    if (result["meta"]["hidden"] is not None):        
        text = f"{player[2]}     |   Hidden"
        hidden = True
    else:
        raw_general_data = result["data"][str(name_dictionary[player[2]])]["pvp"]
        raw_general_data = raw_general_data[next(iter(raw_general_data))]
        wins = raw_general_data["wins"]
        xp = raw_general_data["xp"]
        battles = raw_general_data["battles"]
        text = f"{player[2]}     |    WR = {wins/battles*100 :.2f}% / XP = {xp/battles :.2f} / Battles : {battles}"

    #shipname & artillery
    ship_name = ships_dictionary[player[0]]["name"]
    if ships_dictionary[player[0]]["default_profile"]["artillery"] is None:
        text2 = f"{ship_name}     | CV  "
        print(ships_dictionary[player[0]]["default_profile"])
    else:
        ship_caliber = ships_dictionary[player[0]]["default_profile"]["artillery"]["shells"]["AP"]["name"]
        matcher = re.match(r"^(\d{3})", ship_caliber)
        if not matcher:
            text2 = f"{ship_name}     | AP : unknown"
        else:
            actual_caliber = matcher.group(0)
            if int(actual_caliber) > 380:
                text2 = f"{ship_name}     | AP : {actual_caliber}mm ❌"
            else:
                text2 = f"{ship_name}     | AP : {actual_caliber}mm "

    #details about the ship
    if not hidden:
        r = requests.get(f'https://api.worldofwarships.eu/wows/ships/stats/?application_id={key}&account_id={name_dictionary[player[2]]}&ship_id={player[0]}&fields=pvp.xp%2C+pvp.battles%2C+pvp.wins')
        result = json.loads(r.content.decode('utf-8'))
        raw_specific_data = result["data"][str(name_dictionary[player[2]])][0]["pvp"]
        wins_s = raw_specific_data["wins"]
        xp_s = raw_specific_data["xp"]
        battles_s = raw_specific_data["battles"]
        text2 += f"/ WR = {wins_s/battles_s*100 :.2f}% / XP = {xp_s/battles_s :.2f} / Games : {battles_s}"

    if hidden or battles_s==0:
        color = "grey"
    else:
        total_bat = battles_s + battles
        mean_wr = (battles * (wins/battles*100) + battles_s * (wins_s/battles_s*100))/total_bat
        color = fct_color(mean_wr)

    frame = Canvas(
        master=master,
        relief=RAISED,
        borderwidth=1,
        background=color
    )
    frame.grid(row=i, column=column, padx=5, pady=5)
    label = Label(master=frame, text=text)
    label.pack(padx=5, pady=5)
    label = Label(master=frame, text=text2)
    label.pack(padx=5, pady=5)

mainloop()