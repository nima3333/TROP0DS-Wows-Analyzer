from flask import Flask
import os
import wows_mm
app = Flask(__name__)

@app.route('/')
def hello_world():
    path = "I:\\Games\\World_of_Warships_EU\\replays\\"

    if not os.path.exists(path):
        return f"""
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            </head>
            <body>
            <div class="jumbotron text-center" style="padding: 0">
                <h1>Nima's Wows Analyser</h1>
            </div>
            <div class="alert alert-danger" role="alert" style="text-align: center;">
                The wows directory does not exist
            </div>
            </body>"""

    files = os.listdir(path)
    if "tempArenaInfo.json" not in files:
        return f"""
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <meta http-equiv="refresh" content="5" />
            </head>
            <body>
            <div class="jumbotron text-center" style="padding: 0">
                <h1>Nima's Wows Analyser</h1>
            </div>
            <div>
                <div class="spinner-border" role="status" style="display: block; position: fixed; z-index: 1031; top: 50%; right: 50%; margin-top: -..px; margin-right: -..px;">
                <span class="sr-only">Loading...</span>
                </div>
            </div>
            </body>"""

    stra = wows_mm.get_html(path + "tempArenaInfo.json")
    return f"""
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    </head>
    <body>
    <div class="jumbotron text-center" style="padding: 0">
        <h1>Nima's Wows Analyser</h1>
    </div>
        <div class="row">
        <div class="col-sm-6">
            {stra[0]}
        </div>
        <div class="col-sm-6">
            {stra[1]}
        </div>
        </div>
    </body>"""

if __name__ == "__main__":
    app.run()
