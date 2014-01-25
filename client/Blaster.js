var Blaster = extend(Sprite, function() {
	this.ttl = 100;
	this.width = 800;
	this.height = 800;
	this.rotation = 90;

	this.angle = 0;
});

Blaster.prototype.setAngle = function(angle) {
	this.angle = angle;
	this._scaleString = "scale(1,"+this.angle/10+")";
	this.updateTransform();
}

Blaster.prototype.createNode = function() {
	var node = document.createElement('img');
	node.src = 'images/beam.png';
	node.className = 'beam';
	return node;
}

Blaster.prototype.tick = function(dt) {
	Sprite.prototype.tick.apply(this,arguments);
	this.ttl -= dt;
	if(this.ttl <= 0)
		this.destroy()
};

Blaster.prototype.destroy = function() {
	Sprite.prototype.destroy.apply(this,arguments);
	var self = this;
	var hit = [];
	enemies.forEach(function(e) {
		if(Math.abs(e.angle - self.rotation) < self.angle)
			hit.push(e);
	});

	hit.forEach(function(enemy){enemy.killed()});
}
