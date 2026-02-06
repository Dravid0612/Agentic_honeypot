from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import time

app = FastAPI()

# Allow cross-origin requests for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetectRequest(BaseModel):
    text: str

@app.get("/health")
async def health():
    return {"status":"healthy"}

@app.post("/detect")
async def detect(req: DetectRequest):
    text = req.text.lower()
    is_scam = any(k in text for k in ["upi","otp","bank","verify","transfer","account"])
    confidence = 0.9 if is_scam else 0.2
    return {"isScam": is_scam, "confidence": confidence, "scamType": "generic"}

# Alternative Flask-style endpoints for compatibility
@app.get("/api/scan")
async def api_scan():
    return {"message": "Use POST /detect endpoint instead"}

@app.post("/api/scan")
async def api_scan_post(request: Request):
    data = await request.json()
    url = data.get('url', '')
    scan_type = data.get('scanType', 'quick')
    
    is_scam = 'phishing' in url.lower() or 'scam' in url.lower()
    confidence = 95 if is_scam else 98
    
    return {
        "url": url,
        "isScam": is_scam,
        "confidence": confidence,
        "threats": ["Phishing attempt", "Suspicious domain"] if is_scam else [],
        "scanType": scan_type,
        "timestamp": time.time()
    }

@app.get("/api/stats")
async def get_stats():
    return {
        "total_scans": 0,
        "scams_detected": 0,
        "success_rate": 98.7,
        "avg_response_time": 120
    }

@app.get("/api/logs")
async def get_logs():
    return {
        "logs": [],
        "count": 0
    }

@app.get("/mock")
async def mock_endpoint():
    return {
        "message": "Mock server is running",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/detect",
            "/api/scan",
            "/api/stats",
            "/api/logs"
        ]
    }

if __name__ == '__main__':
    import uvicorn
    print("Starting API server on http://localhost:8000")
    print("Available endpoints:")
    print("  GET  /health")
    print("  POST /detect")
    print("  POST /api/scan")
    print("  GET  /api/stats")
    print("  GET  /api/logs")
    print("  GET  /mock")
    uvicorn.run(app, host="0.0.0.0", port=8000)
