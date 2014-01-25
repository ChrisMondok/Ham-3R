var Enemy = extend(Sprite, function() {
	enemies.push(this);

	this.node.className = "enemy";

	this.word = null;

	this.wordSprite = new Sprite();
	this.wordSprite.width = 64;
	this.wordSprite.node.className = 'word';

	this.width = 16;
	this.height = 16;

	this.rotationSpeed = Math.random()*240-180;

	this.distance = WIDTH/2;

	this.ttl = 4000;
	this.life = 0;
	this.angle = 90;
});

Enemy.prototype.setWord = function(word) {
	this.wordSprite.node.innerHTML = word;
	this.word = word;
}

Enemy.prototype.destroy = function() {
	Sprite.prototype.destroy.apply(this, arguments);
	this.wordSprite.destroy();
	enemies.splice(enemies.indexOf(this, 1));
}

Enemy.prototype.tick = function(dt) {
	Sprite.prototype.tick.apply(this, arguments);
	this.wordSprite.x = this.x;
	this.wordSprite.y = this.y + 32;
	if(this.word)
		this.wordSprite.width = this.word.length * 10;
	this.wordSprite.height = 16;
	this.rotation = this.rotation + this.rotationSpeed*(dt/1000) % 360;

	this.life += dt;

	if(this.life > this.ttl) {
		this.destroy();
		//TODO: lose life
		return;
	}

	var dist = (WIDTH*(1+Math.cos(Math.PI * this.life/this.ttl)))/4;

	var rad = this.angle/180*Math.PI;
//	this.x = dist*(1 + Math.cos(rad))/2;
//	this.y = dist*(1 - Math.sin(rad))/2;
	this.x = WIDTH/2+Math.cos(rad)*dist;
	this.y = WIDTH/2-Math.sin(rad)*dist;
}
