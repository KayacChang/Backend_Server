// ===================================
const mongoose = require('mongoose');

// ===================================
const config = {
    useNewUrlParser: true,
    useCreateIndex: true,
    poolSize: 20,

    reconnectTries: 30,
};

async function Mongo({path}) {
    try {
        const db = await mongoose.connect(path, config);

        return db.connection;
    } catch (err) {
        console.error(err);
    }
}

// ===================================
module.exports = Mongo;

