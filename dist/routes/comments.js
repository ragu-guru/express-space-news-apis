"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../db/index"));
const router = (0, express_1.Router)();
// GET method to retrieve comments for a specific article
router.get('/v1/comments/:articleId', async (req, res) => {
    const { articleId } = req.params; // Get articleId from the URL
    try {
        const client = await index_1.default.connect(); // Get a client from the pool
        // Query to fetch comments and associated usernames
        const { rows } = await client.query(`SELECT users.username, comments.comment, comments.created_at 
             FROM comments 
             JOIN users ON comments.user_id = users.id
             WHERE comments.article_id = $1
             ORDER BY comments.created_at DESC`, // Order by creation date if desired
        [articleId]);
        client.release(); // Release the client back to the pool
        // Return the retrieved comments as JSON
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error('Database query error:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Add comments for a specific article.
router.post('/v1/comments', async (req, res) => {
    const { username, comment, articleId } = req.body;
    // Validate request parameters
    if (!username || !comment || !articleId) {
        return res.status(400).json({ message: 'Username, comment, and articleId are required.' });
    }
    const client = await index_1.default.connect(); // Acquire the database connection
    try {
        // Check if the user already exists
        const userIdQuery = await client.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
        let userId;
        if (userIdQuery.rowCount === 0) {
            // Insert the new user if not found
            const insertUserQuery = await client.query('INSERT INTO users (username) VALUES ($1) RETURNING id', [username]);
            userId = insertUserQuery.rows[0].id;
        }
        else {
            // Use the existing user's ID
            userId = userIdQuery.rows[0].id;
        }
        console.log('User ID:', userId);
        // Insert the comment with the user ID and article ID
        const commentInsertQuery = await client.query('INSERT INTO comments (user_id, comment, article_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *', [userId, comment, articleId]);
        const newComment = commentInsertQuery.rows[0];
        // Return the newly added comment and the list of all comments for the article
        return res.status(201).json({ newComment });
    }
    catch (error) {
        console.error('Error adding comment:', error.message);
        return res.status(500).json({ message: 'Error adding comment' });
    }
    finally {
        client.release(); // Release the database connection back to the pool
    }
});
exports.default = router;
