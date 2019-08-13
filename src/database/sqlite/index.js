// ===================================
const sqlite = require('better-sqlite3');

// ===================================
function Sqlite({path}) {
    return new sqlite(path);
}

// ===================================
module.exports = Sqlite;
