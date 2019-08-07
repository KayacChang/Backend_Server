
// ======================================
const Record = require('./model/record');
const Order = require('./model/order');

// ======================================
const SCHEMA = {
	LOG:	'logdb',
	GAME:	'gamedb',
	PAY:	'paydb',
};

const TABLE = {
	GAME_ACCOUNT:	`${ SCHEMA.GAME }.gameaccount`,
	ACCOUNT:	`${ SCHEMA.GAME }.account`,
	EXCHANGE:	`${ SCHEMA.PAY }.exchange`,
	ULG:		`${ SCHEMA.GAME }.ulgdata`,
};

// ======================================

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
	const COLUMNS = [
		'`index`', 'account.Account', 'Time',
		'IValue1', 'IValue2', 'IValue3', 'Msg',
	].join();

	const LOG = `${ SCHEMA.LOG }.${ date }`;

	const TABLES =
		[ LOG, TABLE.GAME_ACCOUNT, TABLE.ACCOUNT ].join();

	const IS_GAME_RESULT = 'ActivityEvent = 15';
	
	const MERGE_BY_GAME_ACCOUNT =
		`${ TABLE.ACCOUNT }.GameAccount = ${ TABLE.GAME_ACCOUNT }.GameAccount `;

	const MERGE_BY_PLAYER_ID =
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
			${ MERGE_BY_GAME_ACCOUNT }
		AND
			${ MERGE_BY_PLAYER_ID }
			${ CONDITIONS }
		`;

	const results = await this.query( sql );

	return results.map( (data) => Record( date, data ) );
}

async function searchOrderBy( ...conditions ) {
	const COLUMNS = [ 
		'`index`', 'Account', 'CheckOut', 'Time', 
		'CoinType', 'Amount', 'NewGameMoney', 'TotalBet',
		'TotalWin',
	].join();

	const TABLES =
		[ TABLE.EXCHANGE, TABLE.ULG, TABLE.ACCOUNT, TABLE.GAME_ACCOUNT ].join();

	const MERGE_BY_TOKEN =
		`${ TABLE.EXCHANGE }.Token = ${ TABLE.ULG }.GameToken`;

	const MERGE_BY_GAME_ACCOUNT =
		`${ TABLE.ACCOUNT }.GameAccount = ${ TABLE.GAME_ACCOUNT }.GameAccount`;

	const MERGE_BY_PLAYER_ID =
		`${ TABLE.ULG }.PlayerID = ${ TABLE.GAME_ACCOUNT }.PlayerID`;

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
			${ MERGE_BY_TOKEN }
		AND
			${ MERGE_BY_GAME_ACCOUNT }
		AND
			${ MERGE_BY_PLAYER_ID }
			${ CONDITIONS }
		`;

	const results = await this.query( sql );

	return results.map( Order );
}

// ======================================
function bindSQL( it ) {
	const module = {
		searchHistoryBy,
		searchOrderBy,
	};

	return Object.assign( it, module );
}

module.exports = bindSQL;

