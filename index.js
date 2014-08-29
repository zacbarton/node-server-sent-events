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

	res.sse = function(string) {
		res.write(string);
		
		// support running with the compression middleware
		if (string.match(/\n\n$/) && res.flush) {
			res.flush();
		}
	};

	next();
}

module.exports = sse;