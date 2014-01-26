var Laser = extend(Sprite, function() {
	this.ttl = 100;
	this.width = 800;
	this.height = 800;
	this.rotation = 90;
});

Laser.prototype.createNode = function() {
	var node = document.createElement('img');
	node.src = 'images/laser.svg';
	return node;
}

Laser.prototype.tick = function(dt) {
	Sprite.prototype.tick.apply(this,arguments);
	this.ttl -= dt;
	if(this.ttl <= 0)
		this.destroy()
};
