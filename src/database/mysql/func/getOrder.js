
// ===================================
const findOrder = require('../sql/findOrder');

const Order = require('../../../model/order');
// ===================================

async function getOrder(db) {
    const result = await db.query(findOrder());

    return result.map(Order);
}

// ===================================
module.exports = getOrder;
