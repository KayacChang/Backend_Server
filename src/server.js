
const restify = require('restify');

function CORS( req, res, next ) {
	const config = {
		'Access-Control-Allow-Origin': '*' ,
		'Access-Control-Allow-Headers': 'X-Requested-With' 
	};

	for ( const [ key, value ] of Object.entries( config ) ) 
		res.header( key, value );

	return next();
}

// ================================
function Server( { databases } ) {
	const server = restify.createServer();

	server.use(CORS);

	require('./api/game')( { server, databases } );

	return server;
}

// ================================
module.exports = Server;
