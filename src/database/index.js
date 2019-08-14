// ===================================

const Sqlite = require('better-sqlite3');

const {DB} = require('../../config');

const MySQL = require('./mysql');
const Mongo = require('./mongo');

// ===================================
async function Databases() {
    const databases = {};

    databases.domain = new Sqlite(DB.DOMAIN.path);

    const gameDBTasks =
        Object.entries(DB.GAME)
            .map(async ([name, config]) => {
                console.log(`Connect To Game DB [ ${name} ] ...`);

                databases[name] = await MySQL(config);
            });

    await Promise.all(gameDBTasks);

    databases.cms = await Mongo(DB.CMS);

    console.log(`All Databases connected...`);

    return databases;
}

// ===================================
module.exports = Databases;
