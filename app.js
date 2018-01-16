let express = require('express')
let bodyParser = require('body-parser')
let basilStream = require('./basilstream')

let app = express()

app.use(bodyParser.text({ type: 'text/plain' }))
app.use(express.static('public'))

app.post('/post', function(req, res) {
  basilStream.bundleData(req.body)
})

app.listen(3000)
