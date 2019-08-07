
const Record = require('../model/record');

// ==============================
const HISTORY_API = '/games/:game/history/date/:date';

// ==============================

function main( { server, databases } ) {

	// Get History
	server.get( HISTORY_API, getHistory );

	console.log(`API ${HISTORY_API} get ready.`);

	// ==============================
	
	async function getHistory( req, res, next ) {
		const { game, date } = req.params;

		const database = databases[ game ];

		const [ accounts, results ] = await Promise.all([
			database.getAccounts(),
			database.getGameResults( date ),
		]);

		const history = 
			results.map((data) => Record( date, accounts, data ));

		res.send( history );

		return next();
	}

}

// ==============================
module.exports = main;
