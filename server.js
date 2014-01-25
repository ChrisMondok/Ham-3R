var ws = require('ws');
var http = require('http');
var static = require('node-static');
var joystick = require('joystick');

var clientFiles = new static.Server('./client');

var httpServer = http.createServer(function(request, response) {
	request.addListener('end', function() {
		clientFiles.serve(request, response);
	}).resume();
});

var wsServer = new ws.Server({server:httpServer});

var clients = [];

wsServer.on('connection', function(connection) {
	console.log("Connection established!");
	clients.push(connection);
	connection.on('close', function() {
		console.log("Conneciton lost");
		clients.splice(clients.indexOf(connection), 1);
	});
});

httpServer.listen(8080);

var js = new joystick(2, 100, 100);
js.on('button', function(button) {
	if(button.value)
		clients.forEach(function(c){
			c.send(JSON.stringify({fire:true}))
		});
});
js.on('axis', function(movement) {
	if(movement.number)
		return;

	var angle = 90*Math.max(Math.min(25000, movement.value), -25000)/25000;
	clients.forEach(function(c) {
		c.send(JSON.stringify({angle:angle}))
	})
});
