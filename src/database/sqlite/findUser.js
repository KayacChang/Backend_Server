// ======================================
const User = require('../../model/user');

// ======================================
const SQL_FIND_BY_EMAIL = `
	SELECT
		*
	FROM
		User
	WHERE
		email = ?
	`;

// ======================================
function findUser(db, {email}) {
    const result =
        db
            .prepare(SQL_FIND_BY_EMAIL)
            .get(email);

    return result && User(result);
}

// ======================================
module.exports = findUser;
