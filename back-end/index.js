const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('🚀 Connected to MongoDB');
        console.log(`📊 Database: ${process.env.MONGODB_URI.includes('mongodb.net') ? 'Cloud (Atlas)' : 'Local'}`);
    })
    .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error);
        console.error('💡 Make sure your MONGODB_URI is correct in .env file');
        process.exit(1);
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/finance', require('./routes/finance'));

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: '🧬 Life Evolution System API is running!',
        version: '1.0.0',
        status: 'healthy'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Life Evolution System server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed');
    process.exit(0);
});