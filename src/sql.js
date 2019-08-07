
// ======================================
const Record = require('./model/record');

// ======================================
const SCHEMA = {
	LOG:	'logdb',
	GAME:	'gamedb',
};

const TABLE = {
	GAME_ACCOUNT:	`${ SCHEMA.GAME }.gameaccount`,
	ACCOUNT:	`${ SCHEMA.GAME }.account`
};

// ======================================
function getGameResults( date, ...conditions ) {
	const COLUMNS = 
		'`index`, account.Account, Time, IValue1, IValue2, IValue3, Msg';

	const LOG = `${ SCHEMA.LOG }.${ date }`;

	const TABLES =
		[ LOG, TABLE.GAME_ACCOUNT, TABLE.ACCOUNT ].join();

	const IS_GAME_RESULT = 'ActivityEvent = 15';
	
	const BY_GAME_ACCOUNT =
		`${ TABLE.ACCOUNT }.GameAccount = ${ TABLE.GAME_ACCOUNT }.GameAccount `;

	const BY_PLAYER_ID =
		`${ LOG }.PlayerID = ${ TABLE.GAME_ACCOUNT }.PlayerID`;

	const CONDITIONS = 
		conditions
		  .map( (condition) => `AND ${ condition }` )
		  .join('\n');

	const sql =`
		SELECT
			${ COLUMNS }
	   	FROM
	   		${ TABLES }
	  	WHERE
			${ IS_GAME_RESULT }
		AND
			${ BY_GAME_ACCOUNT }
		AND
			${ BY_PLAYER_ID }
			${ CONDITIONS }
		`;

        return this.query( sql );
}

function getAccounts() {
	const TABLES =
		[ TABLE.GAME_ACCOUNT, TABLE.ACCOUNT ].join();

	const CONDITIONS = 
		`${ TABLE.ACCOUNT }.GameAccount = ${ TABLE.GAME_ACCOUNT }.GameAccount`;

	const sql =`
		SELECT
			*
		FROM
	   		${ TABLES }
		WHERE
		 	${ CONDITIONS }
		ORDER BY
		 	PlayerID
		`;

	return this.query( sql );
}

async function searchHistoryBy( date, ...conditions ) {
	const results = await this.getGameResults( date, ...conditions );

	return results.map( (data) => Record( date, data ) );
}

// ======================================
function bindSQL( it ) {
	const module = {
		getGameResults,
		getAccounts,
		searchHistoryBy,
	};

	return Object.assign( it, module );
}

module.exports = bindSQL;

