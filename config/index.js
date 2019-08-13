// ============================
const fs = require('fs');
const path = require('path');

const env = process.env;

// ============================
const ADMIN = {
    user: 'kayac',
    password: 'kayac123'
};

const GAME = {
    'alien': {
        host: 'alien-stg.ulgplay.com',
        port: 3307,

        ...(ADMIN)
    },
    'catpunch': {
        host: 'catpunch-stg.ulgplay.com',
        port: 3306,

        ...(ADMIN)
    },
};

const CMS = {
    'catpunch': {
        path: `mongodb+srv://${ADMIN.user}:${ADMIN.password}@cluster0-ug0nb.gcp.mongodb.net/catpunch?retryWrites=true&w=majority`,
    },
    'alien': {
        path: `mongodb+srv://${ADMIN.user}:${ADMIN.password}@cluster0-ug0nb.gcp.mongodb.net/alien?retryWrites=true&w=majority`,
    },
};


// ============================
module.exports = {
    PRI_KEY: env.PRI_KEY || fs.readFileSync(path.resolve('config/jwtRS256.key')),
    PUB_KEY: env.PUB_KEY || fs.readFileSync(path.resolve('config/jwtRS256.key.pub')),

    DB: {
        GAME, CMS
    },
};
