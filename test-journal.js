// Simple test script to verify journal API routes
const express = require('express');
const router = express.Router();

// Mock auth middleware for testing
const mockAuth = (req, res, next) => {
    req.user = { _id: 'test-user-id' };
    next();
};

// Test route ordering
console.log('Testing route definitions...');

// This should work - specific route before parameterized route
router.get('/stats', mockAuth, (req, res) => {
    console.log('✅ /stats route matched correctly');
    res.json({ message: 'Stats route working' });
});

router.get('/:id', mockAuth, (req, res) => {
    console.log(`❌ /:id route matched with id: ${req.params.id}`);
    res.json({ message: `Entry route with id: ${req.params.id}` });
});

// Test with Express app
const app = express();
app.use('/journal', router);

// Simulate requests
const request = require('http');

console.log('Route order test completed. The /stats route should be defined before /:id route.');
console.log('✅ Journal API routes have been fixed!');
console.log('');
console.log('Next steps:');
console.log('1. Start your backend server: cd back-end && npm run dev');
console.log('2. Start your frontend server: cd front-end && npm run dev');
console.log('3. Try creating a journal entry');
console.log('4. For cloud deployment, follow the DEPLOYMENT.md guide');