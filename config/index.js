
// ============================
require('dotenv').config();

// ============================
const fs = require('fs');

const path = require('path');

const {
    ADMIN_USERNAME,
    ADMIN_PASSWORD,

    DOMAIN_DB_PATH,

    GAME_DB_CATPUNCH_HOST,
    GAME_DB_CATPUNCH_PORT,

    GAME_DB_ALIEN_HOST,
    GAME_DB_ALIEN_PORT,

    CMS_DB_HOST,
    CMS_DB_PORT,

    PRI_KEY,
    PUB_KEY,

} = process.env;

// ============================
const ADMIN = {
    user: ADMIN_USERNAME,
    password: ADMIN_PASSWORD
};

const DOMAIN = {
    path: DOMAIN_DB_PATH
};

const GAME = {
    'alien': {
        host: GAME_DB_ALIEN_HOST,
        port: GAME_DB_ALIEN_PORT,

        ...(ADMIN)
    },
    'catpunch': {
        host: GAME_DB_CATPUNCH_HOST,
        port: GAME_DB_CATPUNCH_PORT,

        ...(ADMIN)
    },
};

const CMS = {
    'alien': {
        path: `mongodb://${ADMIN.user}:${ADMIN.password}@${CMS_DB_HOST}:${CMS_DB_PORT}/alien?retryWrites=true&w=majority`,
    },
    'catpunch': {
        path: `mongodb://${ADMIN.user}:${ADMIN.password}@${CMS_DB_HOST}:${CMS_DB_PORT}/catpunch?retryWrites=true&w=majority`,
    },
};


// ============================
module.exports = {
    PRI_KEY: PRI_KEY || fs.readFileSync(path.resolve('config/jwtRS256.key')),
    PUB_KEY: PUB_KEY || fs.readFileSync(path.resolve('config/jwtRS256.key.pub')),

    DB: {
        DOMAIN, GAME, CMS
    },
};
