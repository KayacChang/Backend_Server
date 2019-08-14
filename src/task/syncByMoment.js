// ===================================

const {
    checkOnStart, connection, startTasks,
    onError, exit,
} = require('./func');

const Model_Record = require('../database/mongo/model/record');

// ===================================

async function updateRecordTask(db) {
    const info = await db.getTableInfo();
    const {date, count} = info.reduce((a, b) => a.date > b.date ? a : b);

    console.log(`Records at Date: ${date} in Game DB, Counts: ${count}`);

    if (!count)
        return console.log(`Current Records are Empty, So Skip...`);

    const [source, target] =
        await Promise.all([
            db.getHistory(date),
            Model_Record.find({date}),
        ]);

    const batches =
        source.filter((data) =>
            !target.find(({uid}) => uid === data.uid));

    if (!batches.length)
        return console.log(`Current Records is Up to date, So Skip...`);

    console.log(`Save Records: ${batches.map(({uid}) => uid).join()}`);

    await Model_Record.insertMany(batches);

    console.log(`Records Count: ${batches.length} Save Success!`);
}

async function updateOrderTask(db) {

}

async function main({target}) {
    try {
        checkOnStart(target);

        const [gameDB] = await connection(target);

        const tasks = [
            updateOrderTask,
        ];

        await startTasks(gameDB, tasks);

        exit();
    } catch (e) {
        return onError(e);
    }
}

const argv = require('minimist')(process.argv.slice(2));
main(argv);
