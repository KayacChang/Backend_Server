// ==============================
const path = require('path');

const {fork} = require('child_process');

// ==============================

function main({server, databases}) {

    //  Get History
    server.get('/history/:game', getHistory);
    console.log(`API [ /history/:game ] get ready.`);

    //  Get History Counts
    server.get('/history-counts/:game', getHistoryCounts);
    console.log(`API [ /history-counts/:game ] get ready.`);

    // ==============================

    async function getHistoryCounts(req, res, next) {
        const proxy = fork(
            path.resolve('src/task/fetchHistoryCounts')
        );

        proxy.send({
            params: req.params,
        });

        proxy.on('message', (result) => {
            res.send(result);

            proxy.kill();

            return next();
        });
    }

    async function getHistory(req, res, next) {
        const proxy = fork(
            path.resolve('src/task/fetchHistory')
        );

        proxy.send({
            params: req.params,
            query: req.query,
        });

        proxy.on('message', (history) => {
            res.send(history);

            proxy.kill();

            return next();
        });
    }
}

// ==============================
module.exports = main;
