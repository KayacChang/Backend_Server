// ======================================
function getTableList(...conditions) {

    const CONDITIONS =
        conditions
            .map((condition) => `AND ${condition}`)
            .join('\n');

    return `
SELECT 
    TABLE_NAME
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'logdb'
AND 
    TABLE_ROWS > 0
${CONDITIONS}

ORDER BY 
    CREATE_TIME
DESC
`;
}

// ======================================
module.exports = getTableList;
