import { Router, Request, Response } from 'express';
import db from '../db/index'; // Adjust the path based on your project structure

const router = Router();

router.get('/v1/metrics', async (req: Request, res: Response): Promise<Response> => {
    try {
        // Fetch top 3 commenters
        const topCommentersQuery = await db.query(`
            SELECT users.username, COUNT(*) as comment_count
            FROM comments
            JOIN users ON users.id = comments.user_id
            GROUP BY username
            ORDER BY comment_count DESC
            LIMIT 3
        `);
        const topCommenters = topCommentersQuery.rows;

        // Fetch average comments per day
        const avgCommentsQuery = await db.query(`
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
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).json({ message: 'Error fetching metrics' });
    }
});

export default router;
