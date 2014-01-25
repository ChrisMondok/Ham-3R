var Player = extend(Sprite, function() {
	this.kl = this.keyboardListener.bind(this);

	document.body.addEventListener('keydown', this.kl);
	document.body.addEventListener('keyup', this.kl);

	this.string = '';

	document.getElementById('gameboard').appendChild(this.node);

	this.x = WIDTH/2;
	this.y = HEIGHT;

	this.left = false;
	this.right = false;
	this.fire = false;

	this.blasterReloadTime = 2000;
	this.blasterDelay = 0;
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

	var handled = true;

	switch(keyEvent.key || keyEvent.keyIdentifier) {
		case "Left":
			this.left = down;
			break;
		case "Right":
			this.right = down;
			break;
		case "Up":
			this.fire = down;
		default:
			handled = false;
			//console.info(keyEvent.key+" unbound");
	}


	if(this.left == this.right) {
		this.left = false;
		this.right = false
	}

	if(handled) {
		keyEvent.preventDefault();
		keyEvent.stopPropagation();
		return false;
	}
}

Player.prototype.tick = function(dt) {
	Sprite.prototype.tick.apply(this, arguments);
	var rdelta = this.left ? -1 : (this.right ? 1 : 0);

	rdelta *= (dt/3);

	this.rotation = Math.min(90, Math.max(this.rotation + rdelta, -90));

	if(this.fire)
		this.fireBlaster();

	this.blasterDelay = Math.max(0,this.blasterDelay-dt);
}

Player.prototype.fireBlaster = function() {
	if(this.blasterDelay && false)
		return;
	this.blasterDelay = this.blasterReloadTime;
	fireBlaster();
};
