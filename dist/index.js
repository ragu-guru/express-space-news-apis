"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./db/index")); // Import the database connection
const comments_1 = __importDefault(require("./routes/comments"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Middleware to parse JSON request body
app.use(express_1.default.json());
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
