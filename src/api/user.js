

// ==============================
const User = require('../model/user');

// ==============================
const API = '/user'

// ==============================

function main( { server, databases } ) {

	// POST 
	server.post( API, addUser );

	console.log(`API [ ${API} ] get ready.`);

	// ==============================

	function getDatabase() {
		return databases.user;
	}

	async function addUser( req, res, next ) {
		const newUser = await User( req.body );

		console.log( newUser );
	}
}

// ==============================
module.exports = main;
