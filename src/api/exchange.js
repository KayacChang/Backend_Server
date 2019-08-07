
const moment = require('moment');

// ==============================
const { slice } = require('../util/str');

// ==============================
const API = '/exchange/:game'

// ==============================

function main( { server, databases } ) {

	// Get Exchange
	server.get( API, getExchange );

	console.log(`API [ ${API} ] get ready.`);

	// ==============================

	function getDatabase( req ) {
		return databases[ req.params.game ];
	}

	async function getExchange( req, res, next ) {
		const database = getDatabase( req );

		const conditions = [];

		if ( req.query.date ) {
			const target =
				moment( req.query.date, 'YYYYMMDD' )
				.unix();

			const next = 
				moment( req.query.date, 'YYYYMMDD' )
				.add( 1, 'd' )
				.unix();

			conditions.push( `Time BETWEEN ${ target } AND ${ next }` );
		} else {
			const current = moment().unix();

			conditions.push( `Time >= ${ current }` );
		}

                if ( req.query.uid ) {
                        const index = req.query.uid;

                        conditions.push( '`index` = ' + index );
                }

                if ( req.query.userID ) {
                        const account = 'ulg:' + req.query.userID;

			conditions.push( `Account = '${ account }'` );
		}

		const orders = await database.searchOrderBy( ...conditions );

		res.send( orders );

		return next();
	}
}

// ==============================
module.exports = main;
