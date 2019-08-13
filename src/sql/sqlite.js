// ======================================
const User = require('../model/user');

// ======================================
const SQL_FIND_BY_EMAIL = `
	SELECT
		*
	FROM
		User
	WHERE
		email = ?
	`;

const SQL_ADD_USER = `
	INSERT INTO 
		User ( name, email, password )
	VALUES
		( ?, ?, ? )
	`;

const SQL_FIND_ALL_PRODUCT = `
	SELECT
		*
	FROM
		Product
	`;

// ======================================

function saveUser({name, email, password}) {
    return this
        .prepare(SQL_ADD_USER)
        .run(name, email, password);
}

function findUser({email}) {
    const result =
        this
            .prepare(SQL_FIND_BY_EMAIL)
            .get(email);

    return result && User(result);
}

function findProduct() {
    return this
        .prepare(SQL_FIND_ALL_PRODUCT)
        .all();
}

function bindSQL(it) {
    const module = {
        saveUser,
        findUser,
        findProduct,
    };

    return Object.assign(it, module);
}

// ======================================

module.exports = bindSQL;

