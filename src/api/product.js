
const findProducts = require('../database/sqlite/findProducts');

// ==============================
const API = '/products';

// ==============================

function main( { server, databases } ) {

	const database = databases.domain;

	server.get( API, getProducts );

	console.log(`API [ ${ API } ] get ready.`);

	// ==============================

	async function getProducts( req, res, next ) {
		const result = findProducts(database);

		res.send( result );

		return next();
	}

}

// ==============================
module.exports = main;
