// ===================================
const moment = require('moment');

const {isEmpty} = require('rambda');

const Order = require('../database/mongo/model/order');
const getOrderCounts = require('../database/mysql/func/getOrderCounts');
const getOrder = require('../database/mysql/func/getOrder');

const MySQL = require('../database/mysql');
const Mongo = require('../database/mongo');

const {DB} = require('../../config');

// ===================================

async function syncDBData(gameDB) {

    const count = await Order.countDocuments({});
    const currentCount = await getOrderCounts(gameDB);

    if (currentCount === count) return;

    const order = await getOrder(gameDB);

    const list = await Order.find().select('uid');

    const targets = order.filter((row) => !list.includes(row.uid));

    await Order.insertMany(targets);
}

async function fetchExchange(req) {
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
        uid, userID, timeStart, timeEnd
    } = req.query;

    const history = await (
        (uid) ? findByUID :
            (userID || timeStart || timeEnd) ? findByUserOrTime :
                findByRange
    )(req.query);

    return process.send(history);
}

function findLatest() {
    return Order.find()
        .sort({time: -1})
        .limit(100);
}

function findByUID({uid}) {
    uid = String(uid);

    return Order.find({uid});
}

function findByUserOrTime({userID, timeStart, timeEnd}) {

    const $lte = timeEnd ? moment(timeEnd, 'YYYYMMDDHHmm').toDate() : undefined;
    const $gte = timeStart ? moment(timeStart, 'YYYYMMDDHHmm').toDate() : undefined;

    const time = {};
    if ($gte) time.$gte = $gte;
    if ($lte) time.$lte = $lte;

    const filter = {};
    if (userID) filter.userID = userID;
    if (!isEmpty(time)) filter['exchange.time']= time;

    return Order.find(filter)
        .sort({time: -1});
}

function findByRange({from, limit}) {
    from = Number(from);
    limit = Number(limit);

    return Order.find()
        .skip(from)
        .sort({time: -1})
        .limit(limit);
}

function main() {
    process.on('message', fetchExchange);
}

main();
