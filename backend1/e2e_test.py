#!/usr/bin/env python3
"""End-to-end integration test for Agentic Honeypot"""
import requests
import json
import time
import sys

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def test_backend_api():
    """Test all backend API endpoints"""
    print_section("BACKEND API TESTS (Port 8000)")
    
    base_url = "http://localhost:8000"
    endpoints = [
        ("GET /health", "health", "get"),
        ("POST /detect", "detect", "post", {"text": "verify your bank account"}),
        ("GET /api/stats", "api/stats", "get"),
        ("GET /api/logs", "api/logs", "get"),
        ("GET /mock", "mock", "get"),
    ]
    
    passed = 0
    failed = 0
    
    for endpoint_info in endpoints:
        name = endpoint_info[0]
        path = endpoint_info[1]
        method = endpoint_info[2]
        payload = endpoint_info[3] if len(endpoint_info) > 3 else None
        
        try:
            if method == "get":
                resp = requests.get(f"{base_url}/{path}", timeout=3)
            else:  # post
                resp = requests.post(f"{base_url}/{path}", json=payload, timeout=3)
            
            if resp.status_code == 200:
                print(f"✅ {name}")
                print(f"   Status: {resp.status_code}")
                print(f"   Response: {resp.json()}\n")
                passed += 1
            else:
                print(f"❌ {name}")
                print(f"   Status: {resp.status_code}")
                print(f"   Error: {resp.text}\n")
                failed += 1
        except Exception as e:
            print(f"❌ {name}")
            print(f"   Error: {str(e)}\n")
            failed += 1
    
    print(f"Backend API Results: ✅ {passed} passed, ❌ {failed} failed\n")
    return passed, failed

def test_frontend():
    """Test frontend endpoint"""
    print_section("FRONTEND TESTS (Port 3001)")
    
    try:
        resp = requests.get("http://localhost:3001/", timeout=5)
        if resp.status_code == 200 and "Agentic Honeypot" in resp.text:
            print(f"✅ GET / (Homepage)")
            print(f"   Status: {resp.status_code}")
            print(f"   Response Length: {len(resp.text)} bytes")
            print(f"   Contains: Agentic Honeypot ✓\n")
            return 1, 0
        else:
            print(f"❌ GET / (Homepage)")
            print(f"   Status: {resp.status_code}")
            print(f"   Error: Page doesn't contain expected content\n")
            return 0, 1
    except Exception as e:
        print(f"❌ GET / (Homepage)")
        print(f"   Error: {str(e)}\n")
        return 0, 1

def test_frontend_api_integration():
    """Test frontend can call backend API"""
    print_section("FRONTEND-BACKEND INTEGRATION TESTS")
    
    passed = 0
    failed = 0
    
    # Test GET endpoints
    backend_endpoints = [
        ("Backend /health", "http://localhost:8000/health", "get"),
        ("Backend /api/stats", "http://localhost:8000/api/stats", "get"),
    ]
    
    for name, url, method in backend_endpoints:
        try:
            resp = requests.get(url, timeout=3)
            if resp.status_code == 200:
                print(f"✅ {name}")
                print(f"   URL: {url}")
                print(f"   Status: {resp.status_code}\n")
                passed += 1
            else:
                print(f"❌ {name}")
                print(f"   URL: {url}")
                print(f"   Status: {resp.status_code}\n")
                failed += 1
        except Exception as e:
            print(f"❌ {name}")
            print(f"   URL: {url}")
            print(f"   Error: {str(e)}\n")
            failed += 1
    
    # Test POST /detect endpoint
    try:
        resp = requests.post("http://localhost:8000/detect", 
                           json={"text": "verify your bank"}, timeout=3)
        if resp.status_code == 200:
            print(f"✅ Backend /detect (POST)")
            print(f"   URL: http://localhost:8000/detect")
            print(f"   Status: {resp.status_code}")
            print(f"   Response: {resp.json()}\n")
            passed += 1
        else:
            print(f"❌ Backend /detect (POST)")
            print(f"   URL: http://localhost:8000/detect")
            print(f"   Status: {resp.status_code}\n")
            failed += 1
    except Exception as e:
        print(f"❌ Backend /detect (POST)")
        print(f"   Error: {str(e)}\n")
        failed += 1
    
    print(f"Integration Results: ✅ {passed} passed, ❌ {failed} failed\n")
    return passed, failed

def main():
    print("\n" + "="*70)
    print("  AGENTIC HONEYPOT - END-TO-END TEST SUITE")
    print("="*70)
    print(f"  Start Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    # Give services time to start
    print("\n⏳ Waiting for services to stabilize...")
    time.sleep(2)
    
    # Run tests
    api_p, api_f = test_backend_api()
    frontend_p, frontend_f = test_frontend()
    integ_p, integ_f = test_frontend_api_integration()
    
    # Summary
    total_passed = api_p + frontend_p + integ_p
    total_failed = api_f + frontend_f + integ_f
    
    print_section("TEST SUMMARY")
    print(f"✅ Total Passed: {total_passed}")
    print(f"❌ Total Failed: {total_failed}")
    print(f"📊 Success Rate: {total_passed}/{total_passed + total_failed} ({100*total_passed/(total_passed+total_failed):.1f}%)\n")
    
    if total_failed == 0:
        print("🎉 ALL TESTS PASSED - SYSTEM IS FULLY OPERATIONAL!\n")
        return 0
    else:
        print(f"⚠️  {total_failed} test(s) failed - Please review errors above\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
