
// ==============================
const API = '/products';

// ==============================

function main( { server, databases } ) {

	const database = databases.cms;

	server.get( API, getProducts );

	console.log(`API [ ${ API } ] get ready.`);

	// ==============================
	function getProducts( req, res, next ) {
		const result = database.findProduct();

		res.send( result );

		return next();
	}
}

// ==============================
module.exports = main;
