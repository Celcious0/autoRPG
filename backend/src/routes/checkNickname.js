import express from 'express';
import pool from '../services/DatabaseService.js';
const router = express.Router();

router.get('/checkNickname', async (req, res) => {
  const { nickname } = req.query;
  if (!nickname) return res.status(400).json({ error: 'nickname required' });
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM users WHERE nickname = ?', [nickname]);
  res.json({ taken: rows[0].cnt > 0 });
});

export default router;