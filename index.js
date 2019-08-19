// ================================
const Server = require('./src/server');
const DataBases = require('./src/database');

const runBGTasks = require('./src/task');

const findProducts = require('./src/database/sqlite/findProducts');
const {log} = require('./src/util/str');

require('dotenv').config();

// ===================================
const {
    SERVER_NAME,
    SERVER_PORT
} = process.env;

// ===================================

async function main() {
    const databases = await DataBases();

    const server = Server({databases});

    server.listen(SERVER_PORT, onStart);

    const products =
        findProducts(databases.domain)
            .map(({name}) => name);

    function onStart() {
        log(`${SERVER_NAME} listening at ${server.url}`);

        runBGTasks(products);
    }
}

// ===================================

main();
