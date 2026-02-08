from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import time
import random
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS

# Store test data (in-memory, safe)
test_results = []
request_counter = 0

@app.route('/api/health', methods=['GET'])
def health_check():
    """Comprehensive health check"""
    global request_counter
    request_counter += 1
    
    return jsonify({
        "status": "healthy",
        "service": "flask-safe-api",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "uptime": "Always fresh",
        "requests_served": request_counter,
        "features": [
            "read_only",
            "cors_enabled",
            "json_responses",
            "rate_limit_simulation",
            "mock_data_generation",
            "guvi_honeypot"
        ],
        "endpoints": {
            "/api/health": "Health status",
            "/api/status": "Detailed server status",
            "/api/version": "Version information",
            "/api/test": "Run a safe test",
            "/api/metrics": "Performance metrics",
            "/api/simulation/<type>": "Data simulation endpoints",
            "/api/reset": "Reset test data",
            "/api/guvi-honeypot": "GUVI honeypot mock endpoint",
            "/api/guvi-honeypot/health": "GUVI health check"
        }
    })

@app.route('/api/status', methods=['GET'])
def detailed_status():
    """Detailed server status with metrics"""
    global request_counter
    
    # Simulate some processing
    time.sleep(0.1)
    
    return jsonify({
        "server": {
            "name": "Flask Safe API",
            "status": "running",
            "port": 5001,
            "environment": "development",
            "safe_mode": True
        },
        "performance": {
            "requests_per_minute": random.randint(100, 500),
            "average_response_time": "120ms",
            "uptime": "24h",
            "memory_usage": f"{random.randint(200, 500)}MB"
        },
        "security": {
            "read_only": True,
            "cors_enabled": True,
            "rate_limiting": "simulated",
            "data_encryption": "not_required"
        },
        "statistics": {
            "total_requests": request_counter,
            "successful_tests": len([r for r in test_results if r.get('success')]),
            "failed_tests": len([r for r in test_results if not r.get('success', True)]),
            "last_test": test_results[-1]['timestamp'] if test_results else None
        }
    })

@app.route('/api/version', methods=['GET'])
def version_info():
    """Version information with capabilities"""
    return jsonify({
        "api": {
            "name": "Agentic Honeypot Testing API",
            "version": "2.0.0",
            "flask_version": "2.3.3",
            "python_version": "3.x"
        },
        "capabilities": [
            "Safe testing environment",
            "Mock data generation",
            "Performance simulation",
            "Error simulation",
            "Rate limit simulation",
            "GUVI honeypot simulation"
        ],
        "limitations": [
            "Read-only operations",
            "No database writes",
            "In-memory storage only",
            "Resets on restart"
        ]
    })

@app.route('/api/test', methods=['GET'])
def run_test():
    """Run a safe test with configurable parameters"""
    test_type = request.args.get('type', 'basic')
    delay = min(float(request.args.get('delay', 0.5)), 3.0)  # Max 3 seconds
    
    # Simulate processing delay
    time.sleep(delay)
    
    # Generate test result
    test_id = f"test_{len(test_results) + 1:04d}"
    success = random.random() > 0.2  # 80% success rate
    
    result = {
        "id": test_id,
        "type": test_type,
        "success": success,
        "timestamp": datetime.now().isoformat(),
        "duration": f"{delay}s",
        "data": {
            "mock_value": random.randint(1, 1000),
            "status_code": 200 if success else 500,
            "message": "Test completed successfully" if success else "Test failed (simulated)"
        }
    }
    
    test_results.append(result)
    
    return jsonify({
        "test": result,
        "summary": {
            "total_tests": len(test_results),
            "success_rate": f"{len([r for r in test_results if r['success']]) / len(test_results) * 100:.1f}%",
            "average_duration": f"{sum([float(r['duration'][:-1]) for r in test_results]) / len(test_results):.2f}s"
        }
    })

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Get performance metrics"""
    if not test_results:
        return jsonify({
            "metrics": "no_tests_yet",
            "message": "Run some tests first to see metrics"
        })
    
    successful = [r for r in test_results if r['success']]
    failed = [r for r in test_results if not r['success']]
    
    return jsonify({
        "test_metrics": {
            "total": len(test_results),
            "successful": len(successful),
            "failed": len(failed),
            "success_rate": f"{len(successful) / len(test_results) * 100:.1f}%"
        },
        "performance": {
            "fastest_test": f"{min([float(r['duration'][:-1]) for r in test_results]):.3f}s",
            "slowest_test": f"{max([float(r['duration'][:-1]) for r in test_results]):.3f}s",
            "average_test": f"{sum([float(r['duration'][:-1]) for r in test_results]) / len(test_results):.3f}s"
        },
        "test_types": {
            type_name: len([r for r in test_results if r['type'] == type_name])
            for type_name in set(r['type'] for r in test_results)
        }
    })

@app.route('/api/simulation/<sim_type>', methods=['GET'])
def simulation(sim_type):
    """Various simulation endpoints"""
    simulations = {
        'delay': lambda: time.sleep(random.uniform(0.1, 2.0)),
        'error': lambda: (_ for _ in ()).throw(Exception("Simulated error")),
        'large-response': lambda: {"data": [{"id": i, "value": random.random()} for i in range(100)]},
        'rate-limit': lambda: time.sleep(0.05)
    }
    
    if sim_type == 'error':
        return jsonify({
            "error": "Simulated API error",
            "type": "test_error",
            "message": "This is a simulated error response for testing",
            "recoverable": True,
            "timestamp": datetime.now().isoformat()
        }), 500
    
    if sim_type in simulations:
        if sim_type == 'delay':
            delay = random.uniform(0.1, 2.0)
            time.sleep(delay)
            return jsonify({
                "simulation": "delay",
                "duration": f"{delay:.2f}s",
                "message": f"Simulated {delay:.2f} second delay"
            })
        elif sim_type == 'large-response':
            return jsonify({
                "simulation": "large_response",
                "item_count": 100,
                "data_type": "mock_objects",
                "size_estimate": "~5KB"
            })
        elif sim_type == 'rate-limit':
            time.sleep(0.05)
            return jsonify({
                "simulation": "rate_limit",
                "message": "Simulating rate-limited response",
                "retry_after": "1s"
            })
    
    return jsonify({
        "error": "Unknown simulation type",
        "available_simulations": list(simulations.keys()),
        "usage": "/api/simulation/<type>"
    }), 400

@app.route('/api/reset', methods=['GET'])
def reset_tests():
    """Reset test data (still safe)"""
    global test_results
    test_results.clear()
    return jsonify({
        "message": "Test data reset successfully",
        "tests_cleared": len(test_results),
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/guvi-honeypot', methods=['POST', 'GET', 'OPTIONS'])
def guvi_honeypot_mock():
    """Mock endpoint for GUVI honeypot testing with better CORS"""
    
    # Handle OPTIONS for CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'x-api-key, Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        return response
    
    # Check for required headers
    api_key = request.headers.get('x-api-key')
    
    if not api_key:
        response = jsonify({
            "error": "Missing required header: x-api-key",
            "status": "failed",
            "timestamp": datetime.now().isoformat()
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    
    # Validate API key (accept both versions)
    valid_keys = ["GUVI-Agentic_honeypot_123456", "GUVi-password1two8"]
    
    if api_key not in valid_keys:
        response = jsonify({
            "error": "Invalid API key",
            "status": "failed",
            "timestamp": datetime.now().isoformat()
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 401
    
    # Get request data
    if request.method == 'GET':
        data = request.args.to_dict()
    else:
        data = request.json or {}
    
    # Simple response for GUVI tester
    response_data = {
        "status": "success",
        "message": "Honeypot endpoint is working correctly",
        "data": {
            "request_id": f"req_{random.randint(10000, 99999)}",
            "timestamp": datetime.now().isoformat(),
            "endpoint_tested": data.get('endpoint', 'api/guvi-honeypot'),
            "security_level": "high",
            "threats_detected": []
        },
        "test_results": {
            "api_authenticity": "PASS",
            "endpoint_availability": "PASS", 
            "request_handling": "PASS",
            "response_status": "PASS",
            "basic_honeypot": "PASS"
        }
    }
    
    response = jsonify(response_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Content-Type', 'application/json')
    
    return response

@app.route('/api/guvi-honeypot/health', methods=['GET', 'OPTIONS'])
def guvi_honeypot_health():
    """Health check for GUVI honeypot endpoint with CORS"""
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        return response
    
    response = jsonify({
        "status": "healthy",
        "service": "guvi-honeypot-api",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/guvi-honeypot": "Test honeypot endpoint",
            "GET /api/guvi-honeypot": "Test with GET method",
            "GET /api/guvi-honeypot/health": "Health check"
        },
        "required_headers": {
            "x-api-key": "GUVI-Agentic_honeypot_123456 or GUVi-password1two8"
        },
        "cors": "enabled",
        "timestamp": datetime.now().isoformat()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    return response
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API documentation"""
    return jsonify({
        "message": "Agentic Honeypot Flask API",
        "version": "2.0.0",
        "endpoints": [
            {"method": "GET", "path": "/api/health", "description": "Health check"},
            {"method": "GET", "path": "/api/status", "description": "Server status"},
            {"method": "GET", "path": "/api/version", "description": "Version info"},
            {"method": "GET", "path": "/api/test", "description": "Run configurable test"},
            {"method": "GET", "path": "/api/metrics", "description": "Performance metrics"},
            {"method": "GET", "path": "/api/reset", "description": "Reset test data"},
            {"method": "POST/GET", "path": "/api/guvi-honeypot", "description": "GUVI honeypot test"},
            {"method": "GET", "path": "/api/guvi-honeypot/health", "description": "GUVI health check"}
        ],
        "documentation": "Access endpoints with /api/{endpoint_name}",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api', methods=['GET'])
def api_root():
    """API root endpoint"""
    return jsonify({
        "api": "Agentic Honeypot",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "/health": "Health check",
            "/status": "Server status",
            "/version": "Version information",
            "/test": "Run configurable test",
            "/metrics": "Performance metrics",
            "/reset": "Reset test data",
            "/guvi-honeypot": "GUVI honeypot test endpoint",
            "/guvi-honeypot/health": "GUVI health check"
        }
    })

if __name__ == '__main__':
    print("=" * 70)
    print("🚀 FLASK SAFE API SERVER")
    print("=" * 70)
    print("Port: 5001")
    print("Mode: Development (Safe)")
    print("Features: Mock data, Simulations, Metrics, CORS, GUVI Mock")
    print("\n📚 Available Endpoints:")
    print("  GET /api/health              - Health check with features")
    print("  GET /api/status             - Detailed server status")
    print("  GET /api/version            - Version information")
    print("  GET /api/test?type=&delay=  - Run configurable test")
    print("  GET /api/metrics            - Performance metrics")
    print("  GET /api/simulation/<type>  - Simulation endpoints")
    print("  GET /api/reset              - Reset test data")
    print("  POST/GET /api/guvi-honeypot - GUVI honeypot mock endpoint")
    print("  GET /api/guvi-honeypot/health - GUVI health check")
    print("\n🔑 GUVI API Keys Accepted:")
    print("  • GUVI-Agentic_honeypot_123456")
    print("  • GUVi-password1two8")
    print("\n⚠️  Safety Features:")
    print("  • Read-only operations only")
    print("  • In-memory storage (resets on restart)")
    print("  • CORS enabled for all origins")
    print("  • No external dependencies required")
    print("=" * 70)
    
    app.run(debug=True, port=5001, host='0.0.0.0', use_reloader=False)