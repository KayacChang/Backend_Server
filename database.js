
const mysql = require('promise-mysql');

// ===================================
const DB_CONFIG = {
	host: 'catpunch-stg.ulgplay.com',
	port: 3306,
	user: 'kayac',
	password: 'kayac123'
};

// ===================================
async function main() {
	const db = await mysql.createPool( DB_CONFIG );

	db.getConnection( onceConnected );

	return db;
}

function onceConnected(err, connection) {
	if ( err ) return console.error( Error( err ) );

	connection.release();
}

function Error(err) {
	const code = err.code;

	return ( 
		( code === 'PROTOCOL_CONNECTION_LOST' ) ? 'Database connection was closed.' :
		( code === 'ER_CON_COUNT_ERROR' ) ? 'Database has too many connections.' :
		( code === 'ECONNREFUSED' ) ? 'Database connection was refused.' :
					'Database error but not be handled'
	);
}

// ===================================
module.exports = main;
