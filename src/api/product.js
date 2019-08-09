
// ==============================

// ==============================
const API = '/products';

// ==============================

function main( { server, databases } ) {
	const services = {
	};

	// Database for User
	const database = databases;

	server.get( API, getProducts );

	console.log(`API [ ${ API } ] get ready.`);

	// ==============================
}

// ==============================
module.exports = main;
