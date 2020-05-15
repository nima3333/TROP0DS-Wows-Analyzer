const zerorpc = require("zerorpc")
let client = new zerorpc.Client()
console.log("here")
client.connect("tcp://127.0.0.1:4242")


let formula = document.querySelector('#formula')
//let result = document.querySelector('#result')
let result = document.body

result.innerHTML = `<div class="jumbotron text-center" style="padding: 0">
<h1>Nima's Wows Analyser</h1>
</div>
<div>
<div class="spinner-border" role="status" style="display: block; position: fixed; z-index: 1031; top: 50%; right: 50%; margin-top: -..px; margin-right: -..px;">
<span class="sr-only">Loading...</span>
</div>
</div>`

window.onload = function() {
  // all of your code goes in here
  // it runs after the DOM is built
}

client.invoke("echo", "aaa", (error, res) => {
  if(error) {
    console.error(error)
  } else {
    var doc = new DOMParser().parseFromString(res, "text/xml");
    console.dir(doc)
    result
    document.body.innerHTML = res
  }
})
/** 
formula.addEventListener('input', () => {
  client.invoke("echo", formula.value, (error, res) => {
    if(error) {
      console.error(error)
    } else {
      result.textContent = res
    }
  })
})

formula.dispatchEvent(new Event('input'))
*/