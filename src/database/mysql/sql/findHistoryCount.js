
function findHistoryCount(date) {

    return `
SELECT
	count(*) as count
FROM
	logdb.${date}
WHERE
	ActivityEvent = 15
`;
}

module.exports = findHistoryCount;
