// ================================
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

// ================================
const CORS = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
});

// ================================
function Server({databases}) {
    const server = restify.createServer();

    // For Query String
    server.use(restify.plugins.queryParser());

    // For POST
    server.use(restify.plugins.bodyParser());

    // For CORS
    server.pre(CORS.preflight);
    server.use(CORS.actual);

    // History Service
    require('./api/history')({server, databases});

    // Exchange Service
    // require('./api/exchange')({server, databases});

    // User Service
    require('./api/user')({server, databases});

    // Product Service
    require('./api/product')({server, databases});

    return server;
}

// ================================
module.exports = Server;
