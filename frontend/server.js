// server.js - Place this in the ROOT directory
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock API endpoints
app.post('/v1/scan', (req, res) => {
    console.log('📡 Received scan request:', req.body);
    
    setTimeout(() => {
        const threats = Math.floor(Math.random() * 5);
        const score = Math.floor(Math.random() * 30) + 70;
        
        res.json({
            status: 'success',
            scan_id: `scan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            threats_detected: threats,
            results: {
                sql_injection: Math.random() > 0.7,
                xss: Math.random() > 0.7,
                csrf: Math.random() > 0.7,
                rate_limit_violation: Math.random() > 0.8,
                data_exfiltration: Math.random() > 0.9
            },
            security_score: score,
            risk_level: score > 85 ? 'Low' : score > 70 ? 'Medium' : 'High',
            recommendations: threats > 0 ? [
                "Implement parameterized queries",
                "Add CSRF tokens to forms",
                "Enable rate limiting on sensitive endpoints"
            ] : [
                "Maintain current security practices",
                "Regular security audits recommended"
            ],
            response_time_ms: Math.floor(Math.random() * 200) + 100
        });
    }, 800);
});

app.get('/v1/status', (req, res) => {
    res.json({
        status: 'operational',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
            scanning: 'online',
            database: 'online',
            monitoring: 'online'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Agentic Honeypot API' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📡 Frontend: http://localhost:${port}`);
    console.log(`🔌 API: http://localhost:${port}/v1/scan`);
    console.log(`📊 Status: http://localhost:${port}/v1/status`);
});