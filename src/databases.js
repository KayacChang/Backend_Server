
const mysql = require('promise-mysql');

// ===================================
const bindSQL = require('./sql');

// ===================================
const DB_CONFIG = {
	'catpunch': {
		host: 'catpunch-stg.ulgplay.com',
		port: 3306,
		user: 'kayac',
		password: 'kayac123'
	}
};

// ===================================
async function DataBase( config ) {
	const connect = await mysql.createPool( config );

	bindSQL( connect );

	connect.getConnection( onceConnected );

	return connect;
}

function onceConnected( err, connection ) {
	if ( err ) return console.error( Error( err ) );

	connection.release();
}

function Error({ code }) {
	return ( 
		( code === 'PROTOCOL_CONNECTION_LOST' ) ? 'Database connection was closed.' :
		( code === 'ER_CON_COUNT_ERROR' ) ? 'Database has too many connections.' :
		( code === 'ECONNREFUSED' ) ? 'Database connection was refused.' :
					'Database error but not be handled'
	);
}

// ===================================
async function DataBases() {
	const databases = {};

	for (const [name, config] of Object.entries( DB_CONFIG )) {
		databases[ name ] = await DataBase( config );
	}

	return databases;
}

// ===================================
module.exports = DataBases;
