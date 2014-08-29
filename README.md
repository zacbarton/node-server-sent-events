server-sent-events
========

Send server messages to the browser (via EventSource).

This middleware will keep the request stream open indefinitely, pad the initial response stream for IE and flush the response if the connect middleware is in use.

Detailed information on how to setup the browser/client can be found [here][1].

Installation
--------

    $ npm install -g server-sent-events


Usage (with express)
--------

// require sse
var sse = require('server-sent-events');
var express = require('express');

var app = express();

app.get('/events', sse, function(req, res) {
	// res.sse is made available via the middleware
	res.sse('data: im from the server\n\n');
});
```

  [1]: https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events