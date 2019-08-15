// ===================================
const findOrderCounts = require('../sql/findOrderCounts');

// ===================================

async function getHistoryCount(db, date) {
    const result = await db.query(findOrderCounts(date));

    return result[0]['count'];
}

// ===================================
module.exports = getHistoryCount;
