// ================================
// const DataBases = require('./src/databases');
// const Server = require('./src/server');

const {fork} = require('child_process');
const path = require('path');

// ===================================
const SERVER_PORT = 8080;

const taskPath = path.resolve('./src/task/sync');

// ===================================
async function main() {
    // const databases = await DataBases();
    //
    // const server = Server({databases});
    //
    // server.listen(SERVER_PORT, onStart);

    fork(taskPath, ['--target', 'catpunch'])

    // function onStart() {
    //     console.log(`${server.name} listening at ${server.url}`);
    // }
}

// ===================================

main();
