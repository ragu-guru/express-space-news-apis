"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../db/index")); // Adjust the path based on your project structure
const router = (0, express_1.Router)();
router.get('/v1/metrics', async (req, res) => {
    try {
        // Fetch top 3 commenters
        const topCommentersQuery = await index_1.default.query(`
            SELECT users.username, COUNT(*) as comment_count
            FROM comments
            JOIN users ON users.id = comments.user_id
            GROUP BY username
            ORDER BY comment_count DESC
            LIMIT 3
        `);
        const topCommenters = topCommentersQuery.rows;
        // Fetch average comments per day
        const avgCommentsQuery = await index_1.default.query(`
            SELECT AVG(comment_count) as average_comments
            FROM (
                SELECT DATE(created_at) as comment_date, COUNT(*) as comment_count
                FROM comments
                GROUP BY comment_date
            ) as daily_counts
        `);
        const averageComments = avgCommentsQuery.rows[0]?.average_comments || 0;
        // Combine the metrics into a response object
        const metrics = {
            topCommenters,
            averageComments,
        };
        return res.status(200).json(metrics);
    }
    catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).json({ message: 'Error fetching metrics' });
    }
});
exports.default = router;
