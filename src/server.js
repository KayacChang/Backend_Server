
const restify = require('restify');

// ================================
const SERVER_PORT = 8080;

// ================================
const server = restify.createServer();

// ================================
server.listen( SERVER_PORT, onStart );

// ================================
function onStart() {
	require('./api/hello')( server );

	console.log(`${server.name} listening at ${server.url}`);
}

// ================================
module.exports = server;
