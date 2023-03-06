const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "destro",
    host: "localhost",
    port: 3000,
    database: "film_node"
});

module.exports = pool;