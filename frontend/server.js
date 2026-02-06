const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// ✅ CRITICAL: Enable CORS
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Serve static files from current directory
app.use(express.static(__dirname));

// ✅ API Endpoint
app.post('/api/scan', (req, res) => {
    console.log('✅ API called successfully');
    res.json({
        status: 'success',
        scan_id: `scan_${Date.now()}`,
        message: 'API connected successfully!',
        threats: Math.floor(Math.random() * 5),
        timestamp: new Date().toISOString()
    });
});

// ✅ Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', server: 'running' });
});

// ✅ Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// ✅ Serve HTML for all routes
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
    console.log(`✅ API: http://localhost:${PORT}/api/scan`);
    console.log(`✅ Test: http://localhost:${PORT}/api/test`);
    console.log('✅ Open above URL in browser');
});