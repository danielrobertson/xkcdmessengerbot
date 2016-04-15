var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', 3000)

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.verify_token) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// proces user interaction 
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            console.log("User text input - " + text)
        }
    }
    res.sendStatus(200)
})

var token = process.env.page_access

// start server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})