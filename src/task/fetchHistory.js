// ===================================
const moment = require('moment');

const {isEmpty} = require('rambda');

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

async function fetchHistory(req) {
    const game = req.params.game;

    const [gameDB] =
        await Promise.all([
            MySQL(DB.GAME[game]),
            Mongo(DB.CMS[game]),
        ]);

    await syncDBData(gameDB);

    let history = undefined;

    if (isEmpty(req.query)) {
        history =
            await Record.find()
                .sort({time: -1})
                .limit(100);

    } else {
        const {from, limit} = req.query;

        history =
            await Record.find()
                .skip(Number(from))
                .sort({time: -1})
                .limit(Number(limit));
    }

    process.send(history);
}

function main() {
    process.on('message', fetchHistory);
}

main();
