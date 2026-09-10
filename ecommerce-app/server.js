const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Healthcheck Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Sample Products Endpoint
app.get('/api/products', (req, res) => {
    res.status(200).json([
        { id: 1, name: 'AuraSound Studio Pro Headphones', price: 299.99, category: 'Audio' },
        { id: 2, name: 'Quantum Ultra Smartwatch', price: 199.50, category: 'Wearables' },
        { id: 3, name: 'CyberLens Mirrorless Camera 4K', price: 849.00, category: 'Photography' },
        { id: 4, name: 'ErgoGrip Mechanical Keyboard', price: 129.99, category: 'Accessories' }
    ]);
});

// Catch-all route to serve the single page frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 AURA E-Commerce Application Running!`);
    console.log(`📡 Local Server URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`===========================================`);
});

// Handle graceful termination for Docker container shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server...');
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});
