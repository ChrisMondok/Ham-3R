var ticked = [];
var _lastTick = new Date();

var WIDTH = 800;
var HEIGHT = 400;

var enemies = [];

var player = null;
var spawner = null;

var ws = null;

(function() {
	var score = 0;

	Object.defineProperty(window, 'score', {
		get: function() {
			return score;
		},
		set: function(value) {
			score = value;
			document.getElementById('score').innerHTML = score;
		}
	});
})();

function addTicked(entity) {
	if(ticked.indexOf(entity) == -1)
		ticked.push(entity);
	else
		throw "Ticked entity added again!";
}

function removeTicked(entity) {
	var index = ticked.indexOf(entity);
	if(index != -1)
		ticked.splice(index,1);
	else
		throw "Tried to untick non-ticked entity";
}

function submitWord(word) {
	if(spawner) spawner.increaseWordLength();
	enemies.forEach(function(e) {
		if(e.word == word) {
			e.killed();
		}
	});
}

window.addEventListener('load', function() {
	console.log("Scripts loaded");

	var input = document.getElementsByTagName('input')[0];

	var gameboard = document.getElementById('gameboard');

	document.body.addEventListener('keydown',function(keyEvent) {
		input.focus();
		switch(keyEvent.keyCode) {
			case 13:
			case 32:
				var word = input.value;
				input.value = '';
				submitWord(word);
				break;
		}
	});

	input.addEventListener('keyup', function() {
		input.value= input.value.trim();
	});

	document.body.addEventListener('mousedown', function(click) {
		input.value = '';
		if(!player)
			return;
		spawner.increaseMouseDifficulty();
		var l = new Laser();
		l.x = player.x;
		l.y = player.y;
		l.rotation = 90;

		var clickX = click.x - gameboard.offsetLeft;
		var clickY = click.y - gameboard.offsetTop;

		l.rotation = (180/Math.PI)*Math.atan2(WIDTH/2 - clickY, clickX-WIDTH/2);

	});

	loadWords(startGame);
}, false);

var WORDS = [];

function loadWords(callback) {
	console.log("Loading words");
	for(var i = 0; i < 30; i++)
		WORDS[i] = [];

	var req = new XMLHttpRequest();
	req.open('GET', 'words.json');
	req.addEventListener('load', function() {
		console.log("Got words");
		JSON.parse(this.response).forEach(function(w) {
			WORDS[w.length].push(w);
		});
		console.log("Words processed.");

		callback();
	});

	req.send();
}

function gotJoystickAngle(angle) {
	if(player)
		player.rotation = -angle;
}

function gotJoystickFire() {
	if(player)
		player.fireBlaster();
}

function startGame() {
	spawner = new Spawner();
	player = new Player();

	score = 0;
	var tickInterval = setInterval(function() {
		var now = new Date();
		var dt = now.getTime() - _lastTick.getTime();

		_lastTick = now;

		ticked.forEach(function(entity) {
			entity.tick(dt);
		});
	}, 1000/30);

}

function fireBlaster() {
	if(player && spawner) {
		var b = new Blaster();
		b.rotation = player.rotation + 90;
		b.setAngle(10 - 10*((spawner.spread-10)/80));
		spawner.increaseSpread();
		b.x = player.x;
		b.y = player.y;
	}
}

function pickWord(length) {
	return WORDS[length][Math.floor(Math.random()*WORDS[length].length)];
}

function addScore(points) {
	score += points;
}

function hitPlayer() {
	if(player)
		player.health -= 100/3;
}

function endGame() {
	if(player && !player.destroyed) {
		player.destroy();
		player = null;
	}

	if(spawner && !spawner.destroyed) {
		spawner.destroy();
		spawner = null;
	}

	while(enemies.length)
		enemies[0].destroy();
	setTimeout(showScoreboard, 1000);
}

function showScoreboard() {
	var scoreboard = document.getElementById('scoreboard');
	scoreboard.style.display = 'table';
	var req = new XMLHttpRequest();
	var name = prompt("Enter your name");
	req.open('GET','/scores.json');
	req.addEventListener('load', function() {
		var scores = JSON.parse(this.response);
		var myScore = {name:name, score: score};
		scores.push(myScore);
		scores.sort(function(a,b) {return b.score - a.score})
			.forEach(function(x) {
				var row = document.createElement('tr');

				var name = document.createElement('td');
				name.innerText = x.name;
				row.appendChild(name);

				var score = document.createElement('td');
				score.innerText = x.score;
				row.appendChild(score);

				scoreboard.getElementsByTagName('tbody')[0].appendChild(row);
			});

		if(scores.indexOf(myScore) < 10) {
			console.log("Submit my score!");
			ws.send(JSON.stringify(myScore));
		}
	});
	req.send();
}
