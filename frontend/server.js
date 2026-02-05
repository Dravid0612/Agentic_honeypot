// server.js - Place this in the ROOT directory (outside public folder)
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Mock API endpoint for testing
app.post('/v1/scan', (req, res) => {
    console.log('📡 Received scan request:', req.body);
    
    // Simulate processing delay
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
                data_exfiltration: Math.random() > 0.9,
                auth_bypass: Math.random() > 0.85,
                insecure_deserialization: Math.random() > 0.9
            },
            security_score: score,
            risk_level: score > 85 ? 'Low' : score > 70 ? 'Medium' : 'High',
            recommendations: threats > 0 ? [
                "Implement parameterized queries",
                "Add CSRF tokens to forms",
                "Enable rate limiting on sensitive endpoints",
                "Validate and sanitize all user inputs",
                "Implement proper session management"
            ] : [
                "Maintain current security practices",
                "Regular security audits recommended",
                "Keep dependencies updated"
            ],
            response_time_ms: Math.floor(Math.random() * 200) + 100
        });
    }, 800);
});

// Additional mock endpoints
app.get('/v1/status', (req, res) => {
    res.json({
        status: 'operational',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
            scanning: 'online',
            database: 'online',
            monitoring: 'online',
            authentication: 'online',
            notifications: 'online'
        },
        metrics: {
            total_scans: Math.floor(Math.random() * 1000) + 500,
            threats_blocked: Math.floor(Math.random() * 5000) + 1000,
            avg_response_time: Math.floor(Math.random() * 100) + 50
        }
    });
});

app.get('/v1/history', (req, res) => {
    const scans = [];
    const now = Date.now();
    
    for (let i = 0; i < 10; i++) {
        const threats = Math.floor(Math.random() * 4);
        scans.push({
            id: `scan_${i.toString().padStart(3, '0')}`,
            url: `https://example.com/${i % 2 === 0 ? 'login' : 'api'}`,
            timestamp: new Date(now - (i * 3600000)).toISOString(),
            threats: threats,
            score: Math.floor(Math.random() * 30) + 70,
            status: threats > 0 ? 'threats_found' : 'clean',
            action_taken: threats > 0 ? 'blocked' : 'monitored'
        });
    }
    
    res.json({
        total_scans: scans.length,
        page: 1,
        page_size: 10,
        scans: scans
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Agentic Honeypot API',
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log('🚀 Agentic Honeypot Server Started!');
    console.log('====================================');
    console.log(`🌐 Frontend: http://localhost:${port}`);
    console.log(`🔌 API Base: http://localhost:${port}/v1`);
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log(`   POST   http://localhost:${port}/v1/scan`);
    console.log(`   GET    http://localhost:${port}/v1/status`);
    console.log(`   GET    http://localhost:${port}/v1/history`);
    console.log(`   GET    http://localhost:${port}/health`);
    console.log('');
    console.log('⚡ Now open http://localhost:3001 in your browser!');
    console.log('====================================');
});