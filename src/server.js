
// ================================
const restify = require('restify');

// ================================
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

	// For Query String
	server.use( restify.plugins.queryParser() );

	// For CORS
	server.use(CORS);

	// History Service
	require('./api/history')( { server, databases } );

	// Exchange Service
	require('./api/exchange')( { server, databases } );

	return server;
}

// ================================
module.exports = Server;
