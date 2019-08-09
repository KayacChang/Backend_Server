
// ===================================
const mysql = require('promise-mysql');
const Sqlite = require('better-sqlite3');

// ===================================
const bindSQL = require('./sql/mysql');
const { bindUser } = require('./sql/sqlite');

// ===================================
const DB_USER = {
		user: 'kayac',
		password: 'kayac123'
};

const DB_CONFIG = {
	// GAME Database
	'alien': {
		host: 'alien-stg.ulgplay.com',
		port: 3306,
	},
	'catpunch': {
		host: 'catpunch-stg.ulgplay.com',
		port: 3306,
	},

	// CMS Database
	'cms': {
		path: 'db/cms.db',
	},
};

// ===================================

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

async function Game_DB( config ) {
	const connect = await mysql.createPool( config );

	bindSQL( connect );

	connect.getConnection( onceConnected );

	return connect;
}

function CMS_DB( { path } ) {
	const database = new Sqlite( path );

	bindUser( database );

	return database;
}

// ===================================
async function DataBases() {
	const databases = {};

	for (const [name, config] of Object.entries( DB_CONFIG )) {

		console.log(`Connect To Database [ ${ name } ] ...`);

		databases[ name ] = 
			( name === 'cms' ) ? CMS_DB( { ...config, name } ) :
				await Game_DB( { ...config, ...DB_USER } );
	}

	console.log(`All Databases connected...`);

	return databases;
}

// ===================================
module.exports = DataBases;
