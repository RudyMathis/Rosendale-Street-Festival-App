import express from 'express';
import labels from '../labels/labels.json' with { type: 'json' };

const router = express.Router();

// Route to serve labels
router.get('/', (req, res) => {
    res.json(labels);
});

export default router;
