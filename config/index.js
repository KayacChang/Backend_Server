
// ============================
const fs = require('fs');
const path = require('path');

const env = process.env;

// ============================
module.exports = {
	PRI_KEY: env.PRI_KEY || fs.readFileSync( path.resolve( 'config/jwtRS256.key' ) ),
	PUB_KEY: env.PUB_KEY || fs.readFileSync( path.resolve( 'config/jwtRS256.key.pub' ) ),
};
