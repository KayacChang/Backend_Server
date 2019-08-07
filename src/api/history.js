
// ==============================
const moment = require('moment');

// ==============================
const { slice } = require('../util');

// ==============================
const API = '/history/:game'

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

		const date = 
			req.query.date || moment().format('YYYYMMDD');

		const conditions = [];

		if ( req.query.uid ) {
			const index = 
				req.query.uid.replace( date, '' );

			conditions.push( '`index` = ' + index );
		}

		if ( req.query.userID ) {
			const account = 'ulg:' + req.query.userID;

			conditions.push( `account.Account = '${ account }'` );
		}

		const history =
			await database.searchHistoryBy( date, ...conditions );

		res.send( history );

		return next();
	}
}

// ==============================
module.exports = main;
