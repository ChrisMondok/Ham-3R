function extend(t, fn) {
	var F = function() {
		t.apply(this, arguments)
		if(fn) fn.apply(this, arguments)
	};

	for(var property in t.prototype) {
		F.prototype[property] = t.prototype[property];
	}

	F.prototype.$super = t.prototype;

	this.destroyed = false;
	
	return F;
}

function TickedEntity() {
	addTicked(this);
}

TickedEntity.prototype.destroy = function() {
	if(this.destroyed) {
		debugger;
		throw "Tried to destroy destroyed entity";
	}
	removeTicked(this);
	this.destroyed = true;
}

TickedEntity.prototype.tick = function(dt) { }
