"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    // user: 'your_username',       // Replace with your PostgreSQL username
    // host: 'localhost',            // Replace with your host if needed
    // database: 'your_database',    // Replace with your database name
    // password: 'your_password',     // Replace with your database password
    // port: 5432,                   // Default PostgreSQL port
    connectionString: "postgres://postgres:admin@localhost:5432/postgres",
});
exports.default = pool;
