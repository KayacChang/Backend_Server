
// ==============================
const moment = require('moment');

// ==============================
const { slice } = require('../util/str');

// ==============================
const API = '/history/:game/:date'

// ==============================

function main( { server, databases } ) {

	// Get History
	server.get( API, getHistory );

	console.log(`API [ ${API} ] get ready.`);

	// ==============================

	function getDatabase( req ) {
		return databases[ req.params.game ];
	}

	async function getHistory( req, res, next ) {
		const database = getDatabase( req );

		const date = req.params.date; 

		const conditions = [];

		const history =
			await database.searchHistoryBy( date, ...conditions );

		res.send( history );

		return next();
	}
}

// ==============================
module.exports = main;
