import { Pool } from 'pg';

const pool = new Pool({
    // user: 'your_username',       // Replace with your PostgreSQL username
    // host: 'localhost',            // Replace with your host if needed
    // database: 'your_database',    // Replace with your database name
    // password: 'your_password',     // Replace with your database password
    // port: 5432,                   // Default PostgreSQL port
    connectionString: "postgres://postgres:admin@localhost:5432/postgres",
});

export default pool;
