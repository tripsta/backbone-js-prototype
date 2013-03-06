
express = require 'express'

app = express()

app.use "/vendor", express.static(__dirname + '/vendor')
app.use "/lib", express.static(__dirname + '/lib')
app.use "/test", express.static(__dirname + '/test')
app.use "/data", express.static(__dirname + '/data')
app.use "/modules", express.static(__dirname + '/modules')
app.use "/styles", express.static(__dirname + '/styles')

app.engine '.ejs', require('ejs').__express
app.set 'view engine', 'ejs'
app.set 'views', "#{__dirname}/test-server-views"

app.get '/a', (req, res) ->
	res.render 'a', {}

app.listen(3000)
