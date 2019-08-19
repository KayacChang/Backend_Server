// ================================
const Server = require('./src/server');
const DataBases = require('./src/database');

const runBGTasks = require('./src/task');

const findProducts = require('./src/database/sqlite/findProducts');
const {log} = require('./src/util/str');

const cluster = require('cluster');
const os = require('os');

require('dotenv').config();

// ===================================
const {
    SERVER_NAME,
    SERVER_PORT
} = process.env;

// ===================================

async function main() {
    const databases = await DataBases();

    if (cluster.isMaster) {
        const cpuCount = os.cpus().length;

        for (let i = 0; i < cpuCount; i++) {
            cluster.fork()
        }

        const products =
            findProducts(databases.domain)
                .map(({name}) => name);

        runBGTasks(products);

        cluster.on('exit', (worker) => {
            log(`Worker: ${worker.id} is Exit !!!`);

            cluster.fork()
        });

    } else {
        const server = Server({databases});

        server.listen(SERVER_PORT, onStart);

        function onStart() {
            log(`${SERVER_NAME} listening at ${server.url}`);
        }
    }

}

// ===================================
main()
