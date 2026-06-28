const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM projects';
    const conditions = [];
    const values = [];

    if (req.query.featured === 'true') {
      conditions.push(`featured = $${values.length + 1}`);
      values.push(true);
    }
    if (req.query.category) {
      conditions.push(`category = $${values.length + 1}`);
      values.push(req.query.category);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, values);
    res.json({ success: true, count: rows.length, data: rows.map(normalize) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: normalize(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const { title, description, techStack = [], imageUrl = '', liveUrl = '', githubUrl = '', featured = false, category = 'Web' } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }
    const { rows } = await pool.query(
      `INSERT INTO projects (title, description, tech_stack, image_url, live_url, github_url, featured, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, techStack, imageUrl, liveUrl, githubUrl, featured, category]
    );
    res.status(201).json({ success: true, data: normalize(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, techStack, imageUrl, liveUrl, githubUrl, featured, category } = req.body;
    const { rows } = await pool.query(
      `UPDATE projects SET
        title       = COALESCE($1, title),
        description = COALESCE($2, description),
        tech_stack  = COALESCE($3, tech_stack),
        image_url   = COALESCE($4, image_url),
        live_url    = COALESCE($5, live_url),
        github_url  = COALESCE($6, github_url),
        featured    = COALESCE($7, featured),
        category    = COALESCE($8, category),
        updated_at  = NOW()
       WHERE id = $9 RETURNING *`,
      [title, description, techStack, imageUrl, liveUrl, githubUrl, featured, category, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: normalize(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Map snake_case DB columns → camelCase for the frontend
function normalize(row) {
  return {
    _id:         row.id,
    title:       row.title,
    description: row.description,
    techStack:   row.tech_stack,
    imageUrl:    row.image_url,
    liveUrl:     row.live_url,
    githubUrl:   row.github_url,
    featured:    row.featured,
    category:    row.category,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}

module.exports = router;
