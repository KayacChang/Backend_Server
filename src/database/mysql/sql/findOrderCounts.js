function findOrderCounts() {

    return `
SELECT count(*) as count
FROM paydb.exchange,
     gamedb.ulgdata,
     gamedb.gameaccount,
     gamedb.account
WHERE paydb.exchange.Token = gamedb.ulgdata.GameToken
  AND gamedb.account.GameAccount = gamedb.gameaccount.GameAccount
  AND gamedb.ulgdata.PlayerID = gamedb.gameaccount.PlayerID
ORDER BY \`index\`
    DESC
`;
}

module.exports = findOrderCounts;
