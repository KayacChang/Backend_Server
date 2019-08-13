function findHistory(date, ...conditions) {

    const CONDITIONS =
        conditions
            .map((condition) => `AND ${condition}`)
            .join('\n');

    return `
SELECT 
    \`index\`,
    account.Account,
    Time,
    IValue1,
    IValue2,
    IValue3,
    Msg
FROM 
    logdb.${date}, 
    gamedb.gameaccount, 
    gamedb.account
WHERE
    ActivityEvent = 15
AND
    gamedb.account.GameAccount = gamedb.gameaccount.GameAccount
AND
    logdb.${date}.PlayerID = gamedb.gameaccount.PlayerID
${CONDITIONS}
`;
}

module.exports = findHistory;
