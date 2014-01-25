var Player = extend(Sprite, function() {
	this.kl = this.keyboardListener.bind(this);

	document.body.addEventListener('keydown', this.kl);
	document.body.addEventListener('keyup', this.kl);

	this.string = '';

	document.getElementById('gameboard').appendChild(this.node);

	this.x = WIDTH/2;
	this.y = 300;

	this.left = false;
	this.right = false;
});

Player.prototype.createNode = function() {
	var node = document.createElement('img');
	node.src = 'images/player.svg';
	node.className = 'player';
	return node;
}

Player.prototype.destroy = function() {
	document.body.removeEventListener(kl);
	Sprite.prototype.destroy.apply(this, arguments);
}

Player.prototype.keyboardListener = function(keyEvent) {
	var down = !(keyEvent.type == 'keyup');

	switch(keyEvent.key || keyEvent.keyIdentifier) {
		case "Left":
			this.left = down;
			break;
		case "Right":
			this.right = down;
			break;
		default:
			console.info(keyEvent.key+" unbound");
	}

	keyEvent.preventDefault();
	keyEvent.stopPropagation();

	if(this.left == this.right) {
		this.left = false;
		this.right = false
	}
	return false;
}

Player.prototype.tick = function(dt) {
	Sprite.prototype.tick.apply(this, arguments);
	var rdelta = this.left ? -1 : (this.right ? 1 : 0);

	rdelta *= (dt/3);

	this.rotation = Math.min(90, Math.max(this.rotation + rdelta, -90));
}
