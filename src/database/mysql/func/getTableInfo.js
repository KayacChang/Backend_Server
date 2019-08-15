
// ===================================
const findTable = require('../sql/findTable');
const findHistoryCounts = require('../sql/findHistoryCounts');

// ===================================

async function getTableInfo(db) {
    const results = await db.query(findTable());

    const tableList = results.map((row) => row['TABLE_NAME']);

    const tasks =
        tableList.map(async (date) => {
            const res = await db.query(findHistoryCounts(date));
            const count = res[0]['count'];

            return {date, count};
        });

    return Promise.all(tasks);
}

// ===================================
module.exports = getTableInfo;
