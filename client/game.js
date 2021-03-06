var ticked = [];
var _lastTick = new Date();

var WIDTH = 800;
var HEIGHT = 400;

var enemies = [];

var player = null;
var spawner = null;

var ws = null;

var tickInterval = null;

var sounds = {};

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
	var hit = false;
	enemies.forEach(function(e) {
		if(e.word == word) {
			hit = true;
			e.killed();
		}
	});
	if(hit)
		playSound('rocket', 0.5);
}

function playSound(name, volume) {
	if(sounds[name]) {
		var s = document.createElement('audio');
		s.src = sounds[name].src;
		if(volume)
			s.volume = volume;
		s.play();
	}
}

window.addEventListener('load', function() {
	console.log("Scripts loaded");

	var input = document.getElementsByTagName('input')[0];

	var gameboard = document.getElementById('gameboard');

	var audioTags = document.getElementsByTagName('audio');
	for(var i = 0; i < audioTags.length; i++)
		sounds[audioTags[i].id.replace('Sound','')] = audioTags[i];


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

	document.getElementById('restartButton').addEventListener('click', startGame);

	document.body.addEventListener('mousedown', function(click) {
		input.value = '';
		if(!player)
			return;
		spawner.increaseMouseDifficulty();
		playSound('laser', 0.4);
		click.preventDefault();
//		var l = new Laser();
//		l.x = player.x;
//		l.y = player.y;
//		l.rotation = 90;
//
//		var clickX = click.x - gameboard.offsetLeft;
//		var clickY = click.y - gameboard.offsetTop;
//
//		l.rotation = (180/Math.PI)*Math.atan2(WIDTH/2 - clickY, clickX-WIDTH/2);

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

	document.getElementById('scoreboard').style.display = 'none';

	score = 0;
	tickInterval = setInterval(function() {
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
		playSound('blaster');
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
	if(player) {
		playSound('hit');
		player.health -= 100/3;
	}
}

function endGame() {
	if(player && !player.destroyed) {
		playSound('gameOver');
		player.destroy();
		player = null;
	}

	if(spawner && !spawner.destroyed) {
		spawner.destroy();
		spawner = null;
	}

	while(enemies.length)
		enemies[0].destroy();

	clearInterval(tickInterval);
	setTimeout(showScoreboard, 1000);
}

function showScoreboard() {
	var scoreboard = document.getElementById('scoreboard');
	scoreboard.style.display = 'table';
	var req = new XMLHttpRequest();
	var name = undefined;
	if(score)
		name = prompt("Enter your name");
	req.open('GET','/scores.json');
	req.addEventListener('load', function() {
		var scores = JSON.parse(this.response);
		var tbody = scoreboard.getElementsByTagName('tbody')[0];
		Array.prototype.slice.apply(tbody.getElementsByTagName('tr')).forEach(function(row) { row.parentNode.removeChild(row); });

		if(score && name) {
			var myScore = {name:name, score: score};
			scores.push(myScore);
		}
		scores.sort(function(a,b) {return b.score - a.score})
			.forEach(function(x) {
				var row = document.createElement('tr');

				var name = document.createElement('td');
				name.innerText = x.name;
				row.appendChild(name);

				var score = document.createElement('td');
				score.innerText = x.score;
				row.appendChild(score);

				tbody.appendChild(row);
			});

		if(name && score && scores.indexOf(myScore) < 10)
			ws.send(JSON.stringify(myScore));
	});
	req.send();
}
