window.addEventListener('load', function() {
	var ws = new WebSocket(window.location.href.replace('http','ws'));

	ws.addEventListener('message', function(m) {
		var data = JSON.parse(m.data);
		if(data.hasOwnProperty('angle'))
			gotJoystickAngle(Number(data.angle));
		if(data.fire)
			gotJoystickFire();
	});

	window.ws = ws;
});
