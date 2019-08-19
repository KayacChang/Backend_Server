// ===================================
const findOrderCounts = require('../sql/findOrderCounts');

// ===================================

async function getOrderCounts(db) {
    const result = await db.query(findOrderCounts());

    return result[0]['count'];
}

// ===================================
module.exports = getOrderCounts;
