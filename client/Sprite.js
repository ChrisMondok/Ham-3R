var Sprite = extend(TickedEntity, function() {
	this.node = this.createNode();
	this.node.style.position = 'absolute';
	this.width = 32;
	this.height = 32;

	var _x = 0, _y = 0,
		_width = 32, _height = 32,
		_rotation = 0;

	Object.defineProperty(this, 'x', {
		get: function() { return _x; },
		set: function(value) {
			_x = value;
			this.node.style.left = Math.floor(_x - this.width/2)+'px';
		},
		enumerable: true
	});

	Object.defineProperty(this, 'y', {
		get: function() { return _y; },
		set: function(value) {
			_y = value;
			this.node.style.top = Math.floor(_y - this.height/2)+'px';
		},
		enumerable: true
	});

	Object.defineProperty(this, 'width', {
		get: function() { return _width; },
		set: function(value) {
			_width = value;
			this.node.style.width = Math.floor(_width) +'px';
		},
		enumerable: true
	});

	Object.defineProperty(this, 'height', {
		get: function() { return _height; },
		set: function(value) {
			_height = value;
			this.node.style.height = Math.floor(_height) +'px';
		},
		enumerable: true
	});

	Object.defineProperty(this, 'rotation', {
		get: function() { return _rotation; },
		set: function(value) {
			_rotation = value;
			var str = 'rotate('+Math.floor(_rotation)+'deg)';
			this.node.style.webkitTransform = str;
			this.node.style.transform = str;
		},
		enumerable: true
	});

	this.x = 0;
	this.y = 0;
	this.width = 32;
	this.height = 32;

	document.getElementById('gameboard').appendChild(this.node);
});

Sprite.prototype.createNode = function() {
	var node = document.createElement('div');
	node.style.display = 'none';
	return node;
};

Sprite.prototype.destroy = function() {
	TickedEntity.prototype.destroy.apply(this,arguments);
	this.node.parentNode.removeChild(this.node);
}

Sprite.prototype.tick = function(dt) {
	this.node.style.display = '';
	TickedEntity.prototype.tick.apply(this,arguments);
};
