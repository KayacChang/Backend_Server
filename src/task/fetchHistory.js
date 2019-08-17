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

    if (isEmpty(req.query)) {
        const history = await findLatest();

        return process.send(history);
    }

    const {
        uid,
    } = req.query;

    const history = await (
        (uid) ? findByUID :
            findByRange
    )(req.query);

    return process.send(history);
}

function findLatest() {
    return Record.find()
        .sort({time: -1})
        .limit(100);
}

function findByUID({uid}) {
    uid = Number(uid);

    return Record.find({uid});
}

function findByRange({from, limit}) {
    from = Number(from);
    limit = Number(limit);

    return Record.find()
        .skip(from)
        .sort({time: -1})
        .limit(limit);
}

function main() {
    process.on('message', fetchHistory);
}

main();
