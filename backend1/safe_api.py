from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Safe health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "safe-api-server",
        "timestamp": datetime.now().isoformat(),
        "message": "API is running safely in read-only mode",
        "endpoints": [
            "/api/health",
            "/api/status", 
            "/api/version",
            "/api/cors-test"
        ]
    })

@app.route('/api/status', methods=['GET'])
def status():
    """Get server status (read-only)"""
    return jsonify({
        "server": "running",
        "uptime": "24 hours",
        "requests_served": 1000,
        "mode": "read-only-safe",
        "last_checked": datetime.now().isoformat()
    })

@app.route('/api/version', methods=['GET'])
def version():
    """Get API version info"""
    return jsonify({
        "name": "Agentic Honeypot API",
        "version": "1.0.0",
        "environment": "development",
        "safe_mode": True,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/cors-test', methods=['GET'])
def cors_test():
    """Test CORS headers"""
    return jsonify({
        "cors_enabled": True,
        "allowed_origins": ["http://localhost:3000"],
        "allowed_methods": ["GET"],
        "message": "CORS is properly configured for safe access"
    })

@app.route('/api/safe-test', methods=['GET'])
def safe_test():
    """Another safe test endpoint"""
    time.sleep(0.5)  # Simulate processing delay
    return jsonify({
        "test": "successful",
        "data": {
            "id": "test_001",
            "type": "read_only",
            "risk_level": "none"
        },
        "message": "This is a safe test with no side effects",
        "execution_time": "0.5 seconds"
    })

if __name__ == '__main__':
    print("🔒 Starting SAFE API Server on http://localhost:5001")
    print("📋 Available endpoints (ALL READ-ONLY):")
    print("   GET /api/health      - Health check")
    print("   GET /api/status      - Server status")
    print("   GET /api/version     - Version info")
    print("   GET /api/cors-test   - CORS test")
    print("   GET /api/safe-test   - Additional test")
    print("\n⚠️  This server is in SAFE MODE - no data modification allowed")
    app.run(debug=False, port=5001)  # Different port to avoid conflicts    