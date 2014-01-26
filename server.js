var ws = require('ws');
var http = require('http');
var static = require('node-static');
var joystick = require('joystick');
var fs = require('fs');

var clientFiles = new static.Server('./client');

var highScores = [];

fs.readFile('highScores.json', 'UTF-8', function(err, data) {
	if(!err)
		highScores = JSON.parse(data);
});

var httpServer = http.createServer(function(request, response) {
	request.addListener('end', function() {
		if(request.url == '/scores.json') {
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.end(JSON.stringify(highScores));
		}
		else
			clientFiles.serve(request, response);
	}).resume();
});

var wsServer = new ws.Server({server:httpServer});

var clients = [];

wsServer.on('connection', function(connection) {
	clients.push(connection);
	connection.on('close', function() {
		clients.splice(clients.indexOf(connection), 1);
	});
	connection.on('message', function(message) {
		try {
			var data = JSON.parse(message);
			if(data.name && data.score)
				addHighScore(data.name, data.score);
		}
		finally {}
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

function addHighScore(name, score) {
	highScores.push({name: name, score: score});

	highScores.sort(function(a,b){return b.score-a.score;});
	while(highScores.length > 10)
		highScores.pop();

	fs.writeFile('highScores.json',JSON.stringify(highScores));
}
