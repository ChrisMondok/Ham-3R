var ticked = [];
var _lastTick = new Date();

var WIDTH = 800;
var HEIGHT = 400;

var enemies = [];

var player = null;
var spawner = null;

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
	console.info("Typed "+word);
	enemies.forEach(function(e) {
		if(e.word == word) {
			e.killed();
			console.log("TODO: INCREASE WORD LENGTH");
		}
	});
}

window.addEventListener('load', function() {
	console.log("Game loaded");

	var input = document.getElementsByTagName('input')[0];

	spawner = new Spawner();
	player = new Player();
	window.spawner = spawner;

	input.addEventListener('keydown',function(keyEvent) {
		switch(keyEvent.keyCode) {
			case 13:
			case 32:
				var word = input.value;
				input.value = '';
				submitWord(word);
				spawner.increaseWordLength();
				break;
		}
	});

	input.addEventListener('keyup', function() {
		input.value= input.value.trim();
	});

	document.body.addEventListener('mouseup', function() {
		spawner.increaseMouseDifficulty();
		input.focus();
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
		b.setAngle(10 - 9.5*((spawner.spread-10)/80));
		spawner.increaseSpread();
		b.x = player.x;
		b.y = player.y;
	}
}

function pickWord(length) {
	return WORDS[length][Math.floor(Math.random()*WORDS[length].length)];
}
