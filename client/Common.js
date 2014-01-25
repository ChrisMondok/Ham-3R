function extend(t, fn) {
	var F = function() {
		t.apply(this, arguments)
		if(fn) fn.apply(this, arguments)
	};

	for(var property in t.prototype) {
		F.prototype[property] = t.prototype[property];
	}

	F.prototype.$super = t.prototype;
	
	return F;
}

function TickedEntity() {
	addTicked(this);
}

TickedEntity.prototype.destroy = function() {
	removeTicked(this);
}

TickedEntity.prototype.tick = function(dt) { }
