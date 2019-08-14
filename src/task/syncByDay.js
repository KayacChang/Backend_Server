// ===================================

const Model_Record = require('../database/mongo/model/record');
const Model_Order = require('../database/mongo/model/order');

const {
    checkOnStart, connection, startTasks,
    onError, exit,
} = require('./func');

// ===================================

async function execute(task) {
    const timeStart = process.hrtime();

    await task();

    const [s, ms] = process.hrtime(timeStart);

    console.log(`Task Done! Execution time: ${s}s ${ms / 1000000}ms...\n`);
}

async function save(db, {date, count}) {
    const isDateExist = await Model_Record.exists({date});

    if (isDateExist) {
        const currentCount = await Model_Record.countDocuments({date});

        if (currentCount > count)
            throw new Error(
                `Records in MongoDB Current Count: ${currentCount} at Date: ${date}\n` +
                `is bigger than Game DB Count: ${count}, Something goes wrong.`
            );

        else if (currentCount === count)
            return console.log(`Skip Save Record Date: ${date}, Equal Row Counts.`);

        else {
            console.log(
                `Save Record Date: ${date} Existed,\n` +
                `But Counts: ${currentCount} less than ${count}.\n` +
                `Drop Old and insert Newest Record.`
            );
            await Model_Record.deleteMany({date});
        }
    }

    const batches = await db.getHistory(date);

    await Model_Record.insertMany(batches);

    console.log(`Record Date: ${date} Count: ${count} Save Success!`);
}


async function saveOrderTask(db) {
    const batches = await db.getOrder();

    const count = batches.length;
    const currentCount = await Model_Order.countDocuments({});

    console.log(
        `Orders Counts in Game DB: ${count}\n` +
        `Order Counts in CMS DB: ${currentCount}`
    );

    if (currentCount > count)
        throw new Error(
            `Orders in MongoDB Current Count: ${currentCount}\n` +
            `is bigger than Game DB Count: ${count}, Something goes wrong.`
        );

    else if (currentCount === batches.length)
        return console.log(`Skip Save Order, Equal Row Counts.`);

    await execute(async () => Model_Order.insertMany(batches));

    console.log(`Orders Count: ${batches.length} Save Success!`);
}

async function saveRecordTask(db) {
    let info = await db.getTableInfo();
    info = info.filter(({count}) => count > 0);

    const totalCounts =
        info
            .map(({count}) => count)
            .reduce((a, b) => a + b, 0);

    let currentCounts = 0;

    console.table(info);

    const tasks =
        info
            .map(async (row) => {
                await execute(async () => save(db, row));

                currentCounts += row.count;

                console.log(`Task: ${currentCounts / totalCounts * 100}% Done...`);
            });

    await Promise.all(tasks);

    console.log(`Records Count: ${currentCounts} Save Success!`);
}

async function main({target}) {
    try {
        checkOnStart(target);

        const [gameDB] = await connection(target);

        const tasks = [
            saveRecordTask,
            saveOrderTask
        ];

        await startTasks(gameDB, tasks);

        exit();
    } catch (e) {
        onError(e);
    }
}

const argv = require('minimist')(process.argv.slice(2));
main(argv);
