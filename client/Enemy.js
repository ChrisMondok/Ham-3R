var Enemy = extend(Sprite, function() {
	enemies.push(this);

	this.node.className = "enemy";

	this.word = null;

	this.wordSprite = new Sprite();
	this.wordSprite.width = 64;
	this.wordSprite.node.className = 'word';
	this.wordSprite.node.style.display = 'none';

	this.width = 48;
	this.height = 48;

	this.rotationSpeed = Math.random()*240-180;

	this.distance = WIDTH/2;

	this.ttl = 4000;
	this.life = 0;
	this.angle = 90;

	this.angleDelta = 0;
});

Enemy.prototype.createNode = function() {
	var node = Sprite.prototype.createNode.apply(this,arguments);
	node.addEventListener('mousedown',this.killed.bind(this));
	return node;
}

Enemy.prototype.killed = function() {
	console.log("TODO: ADD POINTS");
	this.destroy();
}

Enemy.prototype.setWord = function(word) {
	this.wordSprite.node.innerHTML = word;
	this.word = word;
}

Enemy.prototype.setSize = function(size) {
	this.width = size;
	this.height = size;
}

Enemy.prototype.destroy = function() {
	Sprite.prototype.destroy.apply(this, arguments);
	this.wordSprite.destroy();
	var index = enemies.indexOf(this);
	if(index == -1)
		throw "Removed non-existing enemy";
	else
		enemies.splice(index,1);
}

Enemy.prototype.tick = function(dt) {
	if(this.word) {
		this.wordSprite.width = this.word.length * 10;
		this.wordSprite.node.style.display = '';
	}
	this.wordSprite.height = 16;
	this.rotation = this.rotation + this.rotationSpeed*(dt/1000) % 360;

	this.life += dt;

	if(this.life > this.ttl) {
		this.destroy();
		console.warn("Hit player");
		return;
	}

	this.angle = Math.min(180, Math.max(0, this.angle+this.angleDelta*(dt/1000)));

	var dist = (WIDTH*(1+Math.cos(Math.PI * this.life/this.ttl)))/4;

	var rad = this.angle/180*Math.PI;
	this.x = WIDTH/2+Math.cos(rad)*dist;
	this.y = WIDTH/2-Math.sin(rad)*dist;

	this.wordSprite.x = this.x;
	this.wordSprite.y = this.y + 32;

	Sprite.prototype.tick.apply(this, arguments);
}
