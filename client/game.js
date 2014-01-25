var ticked = [];
var _lastTick = new Date();

var WIDTH = 600;
var HEIGHT = 600;

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

window.addEventListener('load', function() {
	window.p = new Player();
}, false);
