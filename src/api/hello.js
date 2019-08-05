
// ================================
const API_NAME = '/hello';

// ================================
function getHello(req, res, next) {
	res.send('Hello');
}

function main(server) {
	server.get( API_NAME, getHello );

	console.log(`API ${API_NAME} get ready.`);
}

// ================================
module.exports = main;
