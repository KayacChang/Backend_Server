// ==============================
const path = require('path');

const {fork} = require('child_process');
// ==============================

function main({server}) {

    // Get Exchange
    server.get('/exchange/:game', getExchange);
    console.log(`API [ /exchange/:game ] get ready.`);

    // Get Exchange
    server.get('/exchange-counts/:game', getExchangeCounts);
    console.log(`API [ /exchange-counts/:game ] get ready.`);

    // ==============================

    async function getExchangeCounts(req, res, next) {
        const proxy = fork(
            path.resolve('src/task/fetchExchangeCounts')
        );

        proxy.send({
            params: req.params,
        });

        proxy.on('message', (history) => {
            res.send(history);

            proxy.kill();

            return next();
        });
    }

    async function getExchange(req, res, next) {
        const proxy = fork(
            path.resolve('src/task/fetchExchange')
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
