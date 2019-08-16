// ===================================
const {fork} = require('child_process');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const moment = require('moment');

const {wait} = require('../util/timer');

const mkdir = promisify(fs.mkdir);

// ===================================
const taskPath = path.resolve('src/task/syncByDay');

// ===================================

async function backGroundTask(target) {
    const logDir = path.resolve(`log/${target}`);
    const errorDir = path.resolve(`error/${target}`);

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

    child.on('error', () => {
        console.error(
            `Error: sync ${target} process error occurred.` +
            `See error message in ${errorPath}.`
        );
    });

    return new Promise((resolve) => {
        child.once('exit', (code) => {
            console.log(`sync ${target} process exited with code: ${code}`);
            return resolve();
        });
    });
}

async function main(tasks) {

    let hasSync = false;

    //  Sync When Server start
    console.log(`Background Task Start at ${moment().format()}`);
    await Promise.all(tasks.map(backGroundTask));
    hasSync = true;
    console.log(`Background Task Done at ${moment().format()}`);

    //  Daily sync
    while (true) {
        const currentTime = moment();

        const tomorrow =
            moment()
                .hour(0).minute(0).second(0)
                .add(1, 'd');

        const targetTime =
            moment()
                .hour(15).minute(30).second(0);

        if (currentTime.valueOf() >= targetTime.valueOf() && !hasSync) {
            console.log(`Background Task Start at ${moment().format()}`);
            await Promise.all(tasks.map(backGroundTask));
            hasSync = true;
            console.log(`Background Task Done at ${moment().format()}`);

            await wait(tomorrow.valueOf() - currentTime.valueOf());
            hasSync = false;
        } else {
            const minute = 60 * 1000;

            await wait(minute);
        }
    }
}

// ===================================
module.exports = main;
