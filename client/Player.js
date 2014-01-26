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

	this.blasterReloadTime = 500;
	this.blasterDelay = 0;

	this.health = 100;

	this.ctx = document.getElementById('healthcanvas').getContext('2d');
});

Player.prototype.createNode = function() {
	var node = document.createElement('img');
	node.src = 'images/player.svg';
	node.className = 'player';
	return node;
}

Player.prototype.destroy = function() {
	document.body.removeEventListener('keydown',this.kl);
	document.body.removeEventListener('keyup',this.kl);
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

	if(this.health <= 0)
		endGame();

	Sprite.prototype.tick.apply(this, arguments);
	var rdelta = this.left ? 1 : (this.right ? -1 : 0);

	rdelta *= (dt/3);

	this.rotation = Math.min(90, Math.max(this.rotation + rdelta, -90));

	if(this.fire)
		this.fireBlaster();

	this.blasterDelay = Math.max(0,this.blasterDelay-dt);

	this.ctx.clearRect(0,0,100,100);
	this.ctx.strokeStyle = "#999999";
	this.ctx.lineWidth = 12;
	this.ctx.beginPath();
	this.ctx.arc(50,50,40,0,Math.PI,false);
	this.ctx.stroke();

	this.ctx.strokeStyle = "#FF0000";
	this.ctx.lineWidth = 8;
	this.ctx.beginPath();
	this.ctx.arc(50,50,40,0,Math.PI,false);
	this.ctx.stroke();

	if(this.health >= 1) {
		this.ctx.strokeStyle = "#00FF00";
		this.ctx.lineWidth = 8;
		this.ctx.beginPath();
		this.ctx.arc(50,50,40, Math.PI, Math.PI*(1-this.health/100), true);
		this.ctx.stroke();
	}
}

Player.prototype.fireBlaster = function() {
	if(this.blasterDelay)
		return;
	this.blasterDelay = this.blasterReloadTime;
	fireBlaster();
};
