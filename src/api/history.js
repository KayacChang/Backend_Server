// ==============================
const moment = require('moment');

const getHistoryFromGameDB = require('../database/mysql/func/getHistory');
const getHistoryCountsFromGameDB = require('../database/mysql/func/getHistoryCounts');

const Record = require('../database/mongo/model/record');

// ==============================

function main({server, databases}) {

    // Get History
    server.get('/history/:game/:date', getHistory);
    console.log(`API [ /history ] get ready.`);

    server.get('/counts/:game', getHistoryCounts);

    // ==============================

    function getDatabase(req) {
        const game = req.params.game;

        databases.cms.useDb(game);

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
        const database = getDatabase(req);

        await syncDBData(database);

        const count = await Record.countDocuments({});

        res.send({count});

        return next();
    }

    async function getHistory(req, res, next) {
        const database = getDatabase(req);

        await syncDBData(database);

        const date = req.params.date;

        const history =
            await Record.find({date}).sort({time: 'desc'});

        res.send(history);

        return next();

    }
}

// ==============================
module.exports = main;
