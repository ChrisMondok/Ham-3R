var Spawner = extend(TickedEntity, function() {
	this.timeSinceSpawn = 0;
	this.targetSpawnRate = 1800;
	this.nextSpawn = 2000;

	this.wordLength = 4;
	this.wordLengthCooldown = 1500;
	this.wordLengthTicksUntilDecrease = 0;

	this.spread = 10;
	this.spreadCooldown = 5000;
	this.spreadTicksUntilDecrease = 0;

	this.mouseDifficulty = 0;
	this.mouseCooldown = 1500;
	this.mouseTicksUntilDecrease = 0;
	
	this.angle = 90;

	this.wordLengthMeter = document.getElementById('wordLengthMeter');
	this.spreadMeter = document.getElementById('spreadMeter');
	this.mouseDifficultyMeter = document.getElementById('mouseDifficultyMeter');
});

Spawner.prototype.tick = function(dt) {
	TickedEntity.prototype.tick.apply(this,arguments);
	this.timeSinceSpawn += dt;

	if(this.timeSinceSpawn >= this.nextSpawn)
		this.spawnEnemy(this.angle);

	this.wordLengthTicksUntilDecrease = Math.max(0,this.wordLengthTicksUntilDecrease-dt);
	if(!this.wordLengthTicksUntilDecrease && this.wordLength > 4) 
		this.decreaseWordLength();

	this.spreadTicksUntilDecrease = Math.max(0, this.spreadTicksUntilDecrease-dt);
	if(!this.spreadTicksUntilDecrease && this.spread > 10) 
		this.decreaseSpread();

	this.mouseTicksUntilDecrease = Math.max(0, this.mouseTicksUntilDecrease-dt);
	if(!this.mouseTicksUntilDecrease && this.mouseDifficulty)
		this.decreaseMouseDifficulty();
};

Spawner.prototype.spawnEnemy = function() {
	this.nextSpawn = (1+(Math.random()*0.6-0.3))*this.targetSpawnRate;

	var e = new Enemy();
	e.angle = this.angle + Math.random()*this.spread*2-this.spread;

	e.ttl = Math.random()*4000+4000;

	e.setWord(pickWord(this.wordLength));

	e.setSize(48 - 46*this.mouseDifficulty/15);

	e.angleDelta = (Math.random()-.5)*2 * this.mouseDifficulty*4;

	this.timeSinceSpawn = 0;

	this.targetSpawnRate = 1800/((score+50000)/50000);

	return e;
};

Spawner.prototype.increaseWordLength = function() {
	this.wordLength = Math.min(20,this.wordLength+1);
	this.wordLengthMeter.value = this.wordLength;
	this.wordLengthTicksUntilDecrease = this.wordLengthCooldown;
};

Spawner.prototype.decreaseWordLength = function() {
	this.wordLength--;
	this.wordLengthTicksUntilDecrease = this.wordLengthCooldown;
	this.wordLengthMeter.value = this.wordLength;
};

Spawner.prototype.increaseSpread = function() {
	this.spread = Math.min(90, this.spread + 80/5);
	this.spreadTicksUntilDecrease = this.spreadCooldown;
	this.spreadMeter.value = Math.round(this.spread);
};

Spawner.prototype.decreaseSpread = function() {
	this.spread -= 80/5;
	this.spreadTicksUntilDecrease = this.spreadCooldown;
	this.spreadMeter.value = Math.round(this.spread);
};

Spawner.prototype.increaseMouseDifficulty = function() {
	this.mouseDifficulty = Math.min(15, this.mouseDifficulty + 1);
	this.mouseDifficultyMeter.value = this.mouseDifficulty;
	this.mouseTicksUntilDecrease = this.mouseCooldown;
};

Spawner.prototype.decreaseMouseDifficulty = function() {
	this.mouseDifficulty--;
	this.mouseDifficultyMeter.value = this.mouseDifficulty;
	this.mouseTicksUntilDecrease = this.mouseCooldown;
};
