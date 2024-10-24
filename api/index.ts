import express, { Request, Response } from 'express';
import pool from './db/index'; // Import the database connection
import cors from 'cors';
import commentsRouter from './routes/comments';
import metricsRouter from './routes/metrics';

const app = express();
const PORT = process.env.PORT || 3005;

// Configure allowed origins
const allowedOrigins = ['http://localhost:3005', 'https://spacenews-sigma.vercel.app'];


// Middleware to parse JSON request body
app.use(express.json());

// Set up CORS options
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps, or curl requests)
        if (!origin) return callback(null, true);

        // Allow only specific origins
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200, // For legacy browser support
};

// Use the CORS middleware with the options
app.use(cors(corsOptions));

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
