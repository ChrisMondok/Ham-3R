var ticked = [];
var _lastTick = new Date();

var WIDTH = 800;
var HEIGHT = 400;

var WORDLENGTH = 4;

var enemies = [];

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

var tickInterval = setInterval(function() {
	var now = new Date();
	var dt = now.getTime() - _lastTick.getTime();

	_lastTick = now;

	ticked.forEach(function(entity) {
		entity.tick(dt);
	});
}, 1000/30);

function submitWord(word) {
	console.info("Typed "+word);
	enemies.forEach(function(e) {
		if(e.word == word) {
			console.log("TODO: ADD POINTS");
			e.destroy();
			console.log("TODO: INCREASE WORD LENGTH");
		}
	});
}

window.addEventListener('load', function() {
	console.log("Game loaded");

	var input = document.getElementsByTagName('input')[0];

	input.addEventListener('keydown',function(keyEvent) {
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

function startGame() {
	console.log("Starting game");
	window.p = new Player();
}

function spawnEnemy(deg) {
	var e = new Enemy();
	e.angle = deg;

	var wordLength = WORDLENGTH+Math.floor(Math.random()*5-2);
	e.setWord(pickWord(wordLength));
}

function pickWord(length) {
	return WORDS[length][Math.floor(Math.random()*WORDS[length].length)];
}
