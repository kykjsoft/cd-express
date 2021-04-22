var http = require('http')
var send = require('send')
var path = require('path')
 
var server = http.createServer(function onRequest (req, res) {
  send(req, path.join(__dirname,'./public',req.url)).pipe(res)
})
 
server.listen(3000)