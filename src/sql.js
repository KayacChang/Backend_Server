
const SCHEMA = {
	LOG:	'logdb',
	GAME:	'gamedb',
};

function getGameResults( date ) {
        const IS_GAME_RESULT = 'ActivityEvent = 15';

	const sql =
		`SELECT
			*
	   	 FROM
	   		${ SCHEMA.LOG }.${ date }
	  	 WHERE
			${ IS_GAME_RESULT }`;

        return this.query( sql );
}

function getAccounts() {
	const TABLE = {
		ULG:	'account',
		GAME:	'gameaccount',
	};

	const COLUMN = {
		ID:	'PlayerID',
		ULG:	'Account',
		GAME:	'GameAccount',
	};

	const sql =
		`SELECT
			*
		 FROM
			${ SCHEMA.GAME }.${ TABLE.ULG },
			${ SCHEMA.GAME }.${ TABLE.GAME }
		 WHERE
			${ TABLE.ULG }.${ COLUMN.GAME } = 
			${ TABLE.GAME }.${ COLUMN.GAME }
		 ORDER BY
			${ COLUMN.ID }`;

	return this.query( sql );
}

function bindSQL( it ) {
	const module = {
		getGameResults,
		getAccounts,
	};

	return Object.assign( it, module );
}

module.exports = bindSQL;

