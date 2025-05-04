const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {}); // Get all lessons
router.get('/lesson/:id', (req, res) => {}); // Get a lesson by ID
router.post('/lesson/create', (req, res) => {}); // Create a new lesson
router.put('/lesson/update/:id', (req, res) => {}); // Update a lesson by ID
router.delete('/lesson/delete/:id', (req, res) => {}); // Delete a lesson by ID

module.exports = router;