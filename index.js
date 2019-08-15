// ================================
const Server = require('./src/server');
const DataBases = require('./src/database');

const runBGTasks = require('./src/task');

const findProducts = require('./src/database/sqlite/findProducts');

// ===================================
const SERVER_PORT = 8080;

// ===================================

async function main() {
    const databases = await DataBases();

    const server = Server({databases});

    server.listen(SERVER_PORT, onStart);

    const products =
        findProducts(databases.domain)
            .map(({name}) => name);

    function onStart() {
        console.log(`${server.name} listening at ${server.url}`);

        runBGTasks(products);
    }
}

// ===================================

main();
