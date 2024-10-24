import express, { Request, Response } from 'express';
import pool from './db/index'; // Import the database connection
import commentsRouter from './routes/comments';
import metricsRouter from './routes/metrics';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON request body
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Example query
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
    }
});

// Use the comments router for routes starting with /api
app.use('/api', commentsRouter);

// Add the metrics route under the /api path
app.use('/api', metricsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
