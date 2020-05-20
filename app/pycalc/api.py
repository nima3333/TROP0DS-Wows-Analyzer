from __future__ import print_function
import sys
import zerorpc
import os
import wows_mm

class CalcApi(object): 
    def echo(self, text):
        path = text
        try:
            if not os.path.exists(path):
                return  """<div id="parent">
                            <div class="jumbotron text-center" style="padding: 0">
                                <h1>Nima's Wows Analyser</h1>
                            </div>
                            <div class="alert alert-danger" role="alert" style="text-align: center;">
                                The wows directory does not exist
                            </div>
                        </div>"""
            files = os.listdir(path)
            if "test.json" not in files:
                return f"""
                    <div class="jumbotron text-center" style="padding: 0">
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
                    </div>"""


            stra = wows_mm.get_html()
            return f"""
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
                <div style="margin:auto">
                    <button id="myBtn" type="button" class="btn btn-secondary btn-lg btn-block">Reload</button>
                </div>
            </div>"""
        except Exception as e:
            return f"error {e}"

def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)

def main():
    addr = 'tcp://127.0.0.1:' + parse_port()
    s = zerorpc.Server(CalcApi())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()