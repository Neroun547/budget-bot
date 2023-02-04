const { createConnection } = require("mysql2");

const connection = createConnection({
    user: "root",
    host: "localhost",
    port: 3306,
    password: "root",
    database: "budget_bot"
}).promise();

module.exports = { connection };
