// ===================================
const findHistoryCount = require('../sql/findHistoryCount');

// ===================================

async function getHistoryCount(db, date) {
    const result = await db.query(findHistoryCount(date));

    return result[0]['count'];
}

// ===================================
module.exports = getHistoryCount;
