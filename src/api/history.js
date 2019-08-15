// ==============================
const moment = require('moment');
const {isEmpty} = require('rambda');

const getHistoryFromGameDB = require('../database/mysql/func/getHistory');
const getHistoryCountsFromGameDB = require('../database/mysql/func/getHistoryCounts');

const Record = require('../database/mongo/model/record');

const Mongo = require('../database/mongo');
const {DB} = require('../../config');

// ==============================

function main({server, databases}) {

    //  Get History
    server.get('/history/:game', getHistoryByDate);
    console.log(`API [ /history/:game ] get ready.`);

    //  Get History Counts
    server.get('/history-counts/:game', getHistoryCounts);
    console.log(`API [ /history-counts/:game ] get ready.`);

    // ==============================

    async function getDatabase(req) {
        const game = req.params.game;

        await Mongo(DB.CMS[game]);

        return databases[game];
    }

    async function syncDBData(gameDB) {
        const date = moment().format('YYYYMMDD');

        const count = await Record.countDocuments({date});
        const currentCount = await getHistoryCountsFromGameDB(gameDB, date);

        if (currentCount === count) return;

        const history = await getHistoryFromGameDB(gameDB, date);
        await Record.deleteMany({date});
        await Record.insertMany(history);
    }

    async function getHistoryCounts(req, res, next) {
        const database = await getDatabase(req);

        await syncDBData(database);

        const count = await Record.countDocuments({});

        res.send({count});

        return next();
    }

    async function getHistoryByDate(req, res, next) {
        const database = await getDatabase(req);

        await syncDBData(database);

        if (isEmpty(req.query)) {

            const history =
                await Record
                    .find({})
                    .sort({time: -1})
                    .limit(100);

            res.send(history);

            return next();
        }


        return next();
    }
}

// ==============================
module.exports = main;
