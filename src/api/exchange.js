// ==============================
const {isEmpty} = require('rambda');

const getOrder = require('../database/mysql/func/getOrder');
const getOrderCounts = require('../database/mysql/func/getOrderCounts');

const Mongo = require('../database/mongo');
const {DB} = require('../../config');

const Order = require('../database/mongo/model/order');

// ==============================

function main({server, databases}) {

    // Get Exchange
    server.get('/exchange/:game', getExchange);
    console.log(`API [ /exchange/:game ] get ready.`);

    // Get Exchange
    server.get('/exchange-counts/:game', getExchangeCounts);
    console.log(`API [ /exchange-counts/:game ] get ready.`);

    // ==============================

    async function getDatabase(req) {
        const game = req.params.game;

        await Mongo(DB.CMS[game]);

        return databases[game];
    }

    async function syncDBData(gameDB) {

        const count = await Order.countDocuments({});
        const currentCount = await getOrderCounts(gameDB);

        if (currentCount === count) return;

        const orders = await getOrder(gameDB);

        await Order.deleteMany({});
        await Order.insertMany(orders);
    }

    async function getExchangeCounts(req, res, next) {
        const database = await getDatabase(req);

        await syncDBData(database);

        const count = await Order.countDocuments({});

        res.send({count});

        return next();
    }

    async function getExchange(req, res, next) {
        const database = await getDatabase(req);

        await syncDBData(database);

        if (isEmpty(req.query)) {

            const orders =
                await Order
                    .find()
                    .sort({time: -1})
                    .limit(100);

            res.send(orders);

            return next();
        }

        const {from, to} = req.query;

        const orders =
            await Order
                .find()
                .where('uid').gt(from).lt(to)
                .sort({time: -1});

        res.send(orders);

        return next();
    }
}

// ==============================
module.exports = main;
