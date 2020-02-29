from flask import Flask
import wows_mm
app = Flask(__name__)

@app.route('/')
def hello_world():
    stra = wows_mm.get_html()
    return f"""
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    </head>
    <body>
    <div class="jumbotron text-center" style="padding: 0">
        <h1>Test Page</h1>
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
