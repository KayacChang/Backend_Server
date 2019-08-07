
// ================================
const bcrypt = require('bcrypt');

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

// ================================
module.exports = {
	hashPW, checkPW,
};
