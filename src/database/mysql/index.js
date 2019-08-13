// ===================================
const mysql = require('promise-mysql');

// ===================================
const getTableInfo = require('./func/getTableInfo');
const getHistory = require('./func/getHistory');
const getOrder = require('./func/getOrder');

// ===================================

function onError({code}) {
    const msg = (
        (code === 'PROTOCOL_CONNECTION_LOST') ? 'Database connection was closed.' :
            (code === 'ER_CON_COUNT_ERROR') ? 'Database has too many connections.' :
                (code === 'ECONNREFUSED') ? 'Database connection was refused.' :
                    'Database error but not be handled'
    );

    return console.error(msg);
}

function onceConnected(err, connection) {
    if (err) return onError(err);

    connection.release();
}

async function MySQL(config) {
    try {
        const connect = await mysql.createPool(config);

        connect.getConnection(onceConnected);

        connect.getTableInfo = () => getTableInfo(connect);
        connect.getHistory = (date) => getHistory(connect, date);
        connect.getOrder = () => getOrder(connect);

        return connect;
    } catch (err) {
       onError(err);
    }
}

module.exports = MySQL;
