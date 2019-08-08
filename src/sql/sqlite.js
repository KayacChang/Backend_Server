
// ======================================

function saveUser( { email, password } ) {
	const SQL = `
		INSERT INTO 
			User ( email, password )
		VALUES
			( ?, ? )
		`;

	return this
		.prepare( SQL )
		.run( email, password );
}

function findUser( { email } ) {
	const SQL = `
		SELECT
			*
		FROM
 			User
		WHERE
			email = ?
		`;

	return this
		.prepare( SQL )
		.get( email );
}

function bindUser( it ) {
	const module = {
		saveUser,
		findUser,
	};

	return Object.assign( it, module );
}

// ======================================

module.exports = {
	bindUser,
};

