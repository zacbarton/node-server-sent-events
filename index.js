function sse(req, res, next) {
	req.socket.setKeepAlive(true);	
	req.socket.setTimeout(0);

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.status(200);

	// export a function to send server-side-events
	res.sse = function(string) {
		res.write(string);
		
		// support running within the compression middleware
		if (res.flush && string.match(/\n\n$/)) {
			res.flush();
		}
	};

	// write 2kB of padding (for IE) and a reconnection timeout
	// then use res.sse to send to the client
	res.write(':' + Array(2049).join(' ') + '\n');
	res.sse('retry: 2000\n\n');

	// keep the connection open by sending a comment
	var keepAlive = setInterval(function() {
    	res.sse(':keep-alive\n\n');
	}, 20000);

	// cleanup on close
	res.on('close', function() {
		clearInterval(keepAlive);
	});

	next();
}

module.exports = sse;