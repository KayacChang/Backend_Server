// ===================================
const MySQL = require('../database/mysql');
const Mongo = require('../database/mongo');
const Model_Record = require('../database/mongo/model/record');

const {DB} = require('../../config');

// ===================================

async function save(db, {date, count}) {
    try {
        const isDateExist = await Model_Record.exists({date});

        if (isDateExist) {
            const currentCount = await Model_Record.countDocuments({date});

            if (currentCount > count)
                throw new Error(
                    `CMS DB Current Count: ${currentCount} in Date: ${date}\n` +
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

    } catch (e) {
        console.error(e);

        process.exit(1);
    }
}

async function main({target}) {

    if (!target) {
        console.error(`Required --target. Process rejected.`);

        return process.exit(1);
    }
    console.log(`================ Start ===================`);

    console.log(`================ Connection ===================`);
    const [gameDB,] =
        await Promise.all([
            MySQL(DB.GAME[target]),
            Mongo(DB.CMS[target]),
        ]);

    console.log(`================ Tasks ===================`);
    // saveRecordTask();
    await saveOrderTask();

    console.log(`=================== Exit ======================`);
    console.log(`Process Success...`);

    return process.exit();

    async function saveOrderTask() {
        const res = await gameDB.getOrder();

        console.log(res);
    }

    async function saveRecordTask() {
        console.log(`================ saveRecordTask ===================`);
        const res = await gameDB.getTableInfo();
        const info = res.filter(({count}) => count > 0);

        const totalCounts =
            info
                .map(({count}) => count)
                .reduce((a, b) => a + b, 0);

        let currentCounts = 0;


        console.log(`Start Saving Records...`);
        console.table(info);

        const tasks =
            info
                .filter(({count}) => count > 0)
                .map(async (row) => {
                    const timeStart = process.hrtime();

                    await save(gameDB, row);
                    const [s, ms] = process.hrtime(timeStart);

                    currentCounts += row.count;

                    console.log(
                        `Execution time: ${s}s ${ms / 1000000}ms.\n` +
                        `Task: ${currentCounts / totalCounts * 100}% Done...\n`);
                });

        console.log(`================ Processing ==================`);

        const timeStart = process.hrtime();

        await Promise.all(tasks);

        const [s, ms] = process.hrtime(timeStart);

        console.log(`================== Task Done ==================`);
        console.log(
            `saveRecordTask Success!\n` +
            `Total Execution time: ${s}s ${ms / 1000000}ms... Total Counts: ${totalCounts}`
        );
    }
}

const argv = require('minimist')(process.argv.slice(2));
main(argv);
