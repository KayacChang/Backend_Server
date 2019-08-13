
// ===================================
const findTable = require('../sql/findTable');
const findHistoryCount = require('../sql/findHistoryCount');

// ===================================

async function getTableInfo(db) {
    const results = await db.query(findTable());

    const tableList = results.map((row) => row['TABLE_NAME']);

    const tasks =
        tableList.map(async (date) => {
            const res = await db.query(findHistoryCount(date));
            const count = res[0]['count'];

            return {date, count};
        });

    return Promise.all(tasks);
}

// ===================================
module.exports = getTableInfo;
