// ======================================

// ======================================
const SQL_ADD_USER = `
	INSERT INTO 
		User ( name, email, password )
	VALUES
		( ?, ?, ? )
	`;

// ======================================
function saveUser(db, {name, email, password}) {
    return db
        .prepare(SQL_ADD_USER)
        .run(name, email, password);
}

// ======================================
module.exports = saveUser;
