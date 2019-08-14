// ================================
const Server = require('./src/server');
const DataBases = require('./src/database');

const {fork} = require('child_process');
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');

const moment = require('moment');

const mkdir = promisify(fs.mkdir);

// ===================================
const SERVER_PORT = 8080;

const taskPath = path.resolve('./src/task/syncByDay');

// ===================================

async function backGroundTask(target) {
    const logDir = path.resolve(`./log/${target}`);
    const errorDir = path.resolve(`./error/${target}`);

    await mkdir(logDir, {recursive: true});
    await mkdir(errorDir, {recursive: true});

    const child = fork(taskPath, ['--target', target], {silent: true});

    const date = moment().format('YYYYMMDD');
    const logPath = path.join(logDir, date + '.log');
    const errorPath = path.join(errorDir, date + '.log');

    const logFile = fs.createWriteStream(logPath, {flags: 'a'});
    const errFile = fs.createWriteStream(errorPath, {flags: 'a'});

    child.stdout.pipe(logFile);
    child.stderr.pipe(errFile);
}

async function main() {
    const databases = await DataBases();

    const server = Server({databases});

    server.listen(SERVER_PORT, onStart);

    // ['catpunch', 'alien'].forEach(backGroundTask);

    function onStart() {
        console.log(`${server.name} listening at ${server.url}`);
    }
}

// ===================================

main();
