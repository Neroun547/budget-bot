const { createConnection } = require("mysql2");

const connection = createConnection({
    user: process.env.userDb,
    host: process.env.hostDb,
    port: Number(process.env.portDb),
    password: process.env.passwordDb,
    database: process.env.database
}).promise();

module.exports = { connection };
