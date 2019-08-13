// ===================================

const {DB_USER, DB_CONFIG} = require('../../config');

// ===================================
async function Index() {
    const databases = {};

    for (const [name, config] of Object.entries(DB_CONFIG)) {

        console.log(`Connect To Database [ ${name} ] ...`);

        databases[name] =
            (name === 'cms') ? CMS_DB({...config, name}) :
                await Game_DB({...config, ...DB_USER});
    }

    console.log(`All Databases connected...`);

    return databases;
}

// ===================================
module.exports = Index;
