// ===================================
const MySQL = require('../database/mysql');
const Mongo = require('../database/mongo');

const {DB} = require('../../config');

// ===================================
const author = 'Kayac Chang';

// ===================================
function checkOnStart(target) {
    console.log(`================ Start ===================`);

    if (!target) throw new Error(`Required --target. Process rejected.`);

    console.log(`Author: ${author}`);
    console.log(`Time: ${new Date()}`);
    console.log();
}

async function connection(target) {
    console.log(`================ Connection ===================`);
    console.log(`Start Connect to [ ${target} ] with Game DB and CMS DB...`);

    const [gameDB,] =
        await Promise.all([
            MySQL(DB.GAME[target]),
            Mongo(DB.CMS[target]),
        ]);

    console.log(`[ ${target} ] Connect Success!\n`);

    return [gameDB]
}

async function startTasks(db, tasks) {
    console.log(`================ Tasks Start ===================\n`);

    const timeStart = process.hrtime();

    for (const task of tasks) {
        console.log(`================ ${task.name} Start ===================`);
        await task(db);
        console.log(`================== ${task.name} Done ==================\n`);
    }

    const [s, ms] = process.hrtime(timeStart);

    console.log(`================ Tasks Done ===================`);

    console.log(`All Tasks Done! Total Execution time: ${s}s ${ms / 1000000}ms...`);
}

function onError(e) {
    console.error(`================ Error ===================`);
    console.error(e);

    process.exit(1);
}

function exit() {
    console.log(`=================== Exit ======================\n\n\n`);

    process.exit();
}

// ===================================
module.exports = {
    checkOnStart,
    connection,
    startTasks,
    onError,
    exit,
};
