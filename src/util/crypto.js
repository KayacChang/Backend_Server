
// ================================
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const path = require('path');
const { PRI_KEY } = require('../../config');

// ================================
const SALT_ROUNDS = 10;

// ================================
async function hashPW( password ) {
        const salt = await bcrypt.genSalt( SALT_ROUNDS );

        return bcrypt.hash( password, salt );
}

async function checkPW( password, hash ) {
        return bcrypt.compare( password, hash );
}

function Token( user, options ) {
	const config = { algorithm: 'RS256', ...options };

	const token = jwt.sign( user, PRI_KEY, config );

	const { exp, iat } = jwt.decode( token );

	return { token, exp, iat };
}

// ================================
module.exports = {
	hashPW, checkPW,
	Token,
};
