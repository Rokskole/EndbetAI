const express = require('express');
const router = express.Router();

// Simple in-memory storage (replace with database)
const userData = {};

// Get user data
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const data = userData[userId] || {
            journal: [],
            tasks: [],
            contacts: [],
            expenses: []
        };
        res.json(data);
    } catch (error) {
        console.error('Error getting user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save user data
router.post('/:userId/data', (req, res) => {
    try {
        const { userId } = req.params;
        const { key, value } = req.body;

        if (!userData[userId]) {
            userData[userId] = {};
        }

        userData[userId][key] = value;
        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


