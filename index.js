function sse(req, res, next) {
	req.socket.setKeepAlive(true);	
	req.socket.setTimeout(0);

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.status(200);

	// https://github.com/TravelingTechGuy/express-eventsource/blob/master/models/eventsource.js#L20
	res.write(':' + Array(2049).join(' ') + '\n');
	res.write('retry: 2000\n');

	// export a function to send server-side-events
	res.sse = function(string) {
		res.write(string);
		
		// support running with the compression middleware
		if (res.flush && string.match(/\n\n$/)) {
			res.flush();
		}
	};

	// keep the connection open by sending a comment
	var keepAlive = setInterval(function() {
    	res.sse(':keep-alive \n\n');
	}, 20000);

	res.on('close', function() {
		clearInterval(keepAlive);
	});

	next();
}

module.exports = sse;