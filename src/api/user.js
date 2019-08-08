
// ==============================
const errors = require('restify-errors');
const jwt = require('restify-jwt-community');

const { hashPW, checkPW, Token } = require('../util/crypto');

const { PUB_KEY } = require('../../config');

// ==============================
const API = '/users';

const Error = { 
	NotSupport: ( method ) => new errors.MethodNotAllowedError(
		`Not Support: ${ method }`
	),
	Auth: () => new errors.UnauthorizedError( 
		`Authentication Failed.` 
	),
	Conflict: ( email ) => new errors.ConflictError(
		`User: [${ email }] already existed.` 
	),
};

const TokenAuth = jwt({
	secret: PUB_KEY,
	getToken: req => req.headers.authorization,
});

// ==============================

function main( { server, databases } ) {
	const services = {
		register,
		auth,
	};

	// For JWT Token Authentication
	const path = 
		Object.keys( services )
			.map( method => `${ API }/${ method }` );
        server.use( TokenAuth.unless({ path }) );

	// Database for User
	const database = databases.user;

	server.post( `${ API }/:method`, onPost );

	console.log(`API [ ${ API } ] get ready.`);

	// ==============================
	function onPost( req, res, next ) {
		const { method } = req.params;

		const operation = { 
			register,
			auth,
		}[ method ];

		if ( !operation ) return next( Error.NotSupport( method ) );

		return operation( req, res, next );
	}

	async function register( req, res, next ) {
		const existed = database.findUser( req.body );
		
		if ( existed ) return next ( Error.Conflict( req.body.email ) );

		const email = req.body.email;

		const password = await hashPW( req.body.password );

		const result = database.saveUser( { email, password } );

		res.send( 201 );

		return next();
	}

	async function auth( req, res, next ) {
		const user = database.findUser( req.body );

		if ( !user ) return next( Error.Auth() );

		const matched = await checkPW( req.body.password, user.password );

		if ( !matched ) return next( Error.Auth() );

		const token = Token( user, { expiresIn: '1d' } );

		res.send( token );

		return next();
	}
}

// ==============================
module.exports = main;
