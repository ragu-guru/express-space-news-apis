"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./db/index")); // Import the database connection
const cors_1 = __importDefault(require("cors"));
const comments_1 = __importDefault(require("./routes/comments"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
// Configure allowed origins
const allowedOrigins = ['http://localhost:3005', 'https://spacenews-sigma.vercel.app'];
// Middleware to parse JSON request body
app.use(express_1.default.json());
// Set up CORS options
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, or curl requests)
        if (!origin)
            return callback(null, true);
        // Allow only specific origins
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200, // For legacy browser support
};
// Use the CORS middleware with the options
app.use((0, cors_1.default)(corsOptions));
app.get('/', async (req, res) => {
    try {
        const result = await index_1.default.query('SELECT NOW()'); // Example query
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
    }
});
// Use the comments router for routes starting with /api
app.use('/api', comments_1.default);
// Add the metrics route under the /api path
app.use('/api', metrics_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
