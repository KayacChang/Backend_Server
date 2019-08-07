
const { hashPW } = require('../util/crypto');

// ======================
async function User( data ) {
	const email = data.email;

	const password = await hashPW( data.password );

	return { email, password };
}

// ======================
module.exports = User;
