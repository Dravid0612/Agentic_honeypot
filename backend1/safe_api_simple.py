from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime
import time
from urllib.parse import urlparse, parse_qs
import random

class SimpleAPIHandler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        self.send_cors_headers()
        
        # Routing
        routes = {
            '/api/health': self.handle_health,
            '/health': self.handle_health,
            '/api/status': self.handle_status,
            '/status': self.handle_status,
            '/api/version': self.handle_version,
            '/version': self.handle_version,
            '/api/quick-test': self.handle_quick_test,
            '/api/ping': self.handle_ping,
            '/api/info': self.handle_info,
            '/': self.handle_root
        }
        
        handler = routes.get(path, self.handle_not_found)
        handler()
    
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache')
    
    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())
    
    def handle_health(self):
        self.send_json_response({
            "server": "simple_http_api",
            "status": "healthy",
            "port": 5002,
            "timestamp": datetime.now().isoformat(),
            "requests": getattr(self.server, 'count', 0),
            "simple_mode": True
        })
    
    def handle_status(self):
        self.send_json_response({
            "status": "operational",
            "started": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "performance": "excellent",
            "dependencies": "none",
            "safe": True
        })
    
    def handle_version(self):
        self.send_json_response({
            "name": "Simple HTTP API",
            "version": "1.0.0",
            "technology": "Python HTTP Server",
            "lightweight": True
        })
    
    def handle_quick_test(self):
        # Simulate test with random result
        time.sleep(random.uniform(0.1, 0.5))
        self.send_json_response({
            "test": "quick",
            "result": "success",
            "duration": f"{random.uniform(0.1, 0.5):.2f}s",
            "score": random.randint(1, 100)
        })
    
    def handle_ping(self):
        self.send_json_response({
            "message": "pong",
            "timestamp": datetime.now().isoformat(),
            "server_time": time.time()
        })
    
    def handle_info(self):
        self.send_json_response({
            "description": "Zero-dependency API Server",
            "port": 5002,
            "protocol": "HTTP/1.1",
            "max_connections": "unlimited",
            "safe_for": ["testing", "development", "demo"],
            "features": ["no_install", "fast_startup", "cors_enabled"]
        })
    
    def handle_root(self):
        self.send_json_response({
            "message": "Simple HTTP API Server",
            "endpoints": [
                {"path": "/api/health", "method": "GET", "desc": "Health check"},
                {"path": "/api/status", "method": "GET", "desc": "Server status"},
                {"path": "/api/version", "method": "GET", "desc": "Version info"},
                {"path": "/api/quick-test", "method": "GET", "desc": "Quick test"},
                {"path": "/api/ping", "method": "GET", "desc": "Ping endpoint"},
                {"path": "/api/info", "method": "GET", "desc": "Server info"}
            ],
            "tip": "This server has zero dependencies!"
        })
    
    def handle_not_found(self):
        self.send_json_response({
            "error": "Endpoint not found",
            "available": [
                "/api/health", "/api/status", "/api/version",
                "/api/quick-test", "/api/ping", "/api/info"
            ]
        }, 404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Count requests
        if not hasattr(self.server, 'count'):
            self.server.count = 0
        self.server.count += 1
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {self.address_string()} - {self.path}")

def run_simple_server(port=5002):
    """Start the simple HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleAPIHandler)
    httpd.count = 0
    
    print("=" * 60)
    print("⚡ SIMPLE HTTP API SERVER")
    print("=" * 60)
    print(f"Port: {port}")
    print("Dependencies: NONE (Built-in Python)")
    print("\n🚀 Available Endpoints:")
    print("  GET /api/health     - Health check")
    print("  GET /api/status     - Server status")
    print("  GET /api/version    - Version information")
    print("  GET /api/quick-test - Quick performance test")
    print("  GET /api/ping       - Simple ping/pong")
    print("  GET /api/info       - Server information")
    print("\n💡 Features:")
    print("  • Zero dependencies")
    print("  • Instant startup")
    print("  • Ultra lightweight")
    print("  • Perfect for testing")
    print("=" * 60)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n📊 Total requests: {httpd.count}")
        print("👋 Server stopped")

if __name__ == '__main__':
    run_simple_server(5002)