// ===================================
const moment = require('moment');

const Record = require('../database/mongo/model/record');
const getHistoryCounts = require('../database/mysql/func/getHistoryCounts');
const getHistory = require('../database/mysql/func/getHistory');

const MySQL = require('../database/mysql');
const Mongo = require('../database/mongo');

const {DB} = require('../../config');

// ===================================

async function syncDBData(gameDB) {
    const date = moment().format('YYYYMMDD');

    const count = await Record.countDocuments({date});
    const currentCount = await getHistoryCounts(gameDB, date);

    if (currentCount === count) return;

    const history = await getHistory(gameDB, date);
    await Record.deleteMany({date});
    await Record.insertMany(history);
}

async function fetchHistoryCounts(req) {
    const game = req.params.game;

    const [gameDB] =
        await Promise.all([
            MySQL(DB.GAME[game]),
            Mongo(DB.CMS[game]),
        ]);

    await syncDBData(gameDB);

    const counts = await Record.countDocuments({});

    process.send({counts});
}

function main() {
    process.on('message', fetchHistoryCounts);
}

main();
