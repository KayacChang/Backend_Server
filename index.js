
const DataBases = require('./src/databases');
const Server = require('./src/server');

// ===================================
const SERVER_PORT = 8080;

// ===================================
async function main() {
	const databases = await DataBases();

	const server = Server( { databases } );

	server.listen( SERVER_PORT, onStart );

	function onStart() {
		console.log(`${server.name} listening at ${server.url}`);
	}
}

// ===================================

main();
