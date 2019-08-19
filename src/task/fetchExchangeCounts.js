// ===================================
const Order = require('../database/mongo/model/order');

const Mongo = require('../database/mongo');

const {DB} = require('../../config');

// ===================================

async function fetchExchangeCounts(req) {
    const game = req.params.game;

    await Mongo(DB.CMS[game]);

    const counts = await Order.countDocuments({});

    return process.send({counts});
}

function main() {
    process.on('message', fetchExchangeCounts);
}

main();
