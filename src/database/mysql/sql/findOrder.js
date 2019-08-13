function findOrder(...conditions) {

    const CONDITIONS =
        conditions
            .map((condition) => `AND ${condition}`)
            .join('\n');

    return `
SELECT 
    \`index\`,
    Account,
    CheckOut,
    Time,
    CoinType,
    Amount,
    NewGameMoney,
    TotalBet,
    TotalWin
FROM 
    paydb.exchange,
    gamedb.ulgdata,
    gamedb.gameaccount,
    gamedb.account
WHERE 
    paydb.exchange.Token = gamedb.ulgdata.GameToken
AND 
    gamedb.account.GameAccount = gamedb.gameaccount.GameAccount
AND 
    gamedb.ulgdata.PlayerID = gamedb.gameaccount.PlayerID
${CONDITIONS}

ORDER BY 
    \`index\`
DESC
`;
}

module.exports = findOrder;
