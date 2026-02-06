#!/usr/bin/env python3
"""Test script for API validation"""
import requests
import json
import time

def test_apis():
    """Test all API endpoints"""
    base_url = "http://localhost:8001"
    
    print("="*60)
    print("🧪 API TESTING")
    print("="*60)
    
    # Test 1: Health check
    try:
        print("\n✓ Testing GET /health...")
        response = requests.get(f"{base_url}/health", timeout=3)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 2: Detect endpoint
    try:
        print("\n✓ Testing POST /detect...")
        payload = {"text": "please verify your bank account by clicking this link"}
        response = requests.post(f"{base_url}/detect", json=payload, timeout=3)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 3: API Scan endpoint
    try:
        print("\n✓ Testing POST /api/scan...")
        payload = {"url": "http://phishing-site.com", "scanType": "quick"}
        response = requests.post(f"{base_url}/api/scan", json=payload, timeout=3)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 4: Stats endpoint
    try:
        print("\n✓ Testing GET /api/stats...")
        response = requests.get(f"{base_url}/api/stats", timeout=3)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 5: Logs endpoint
    try:
        print("\n✓ Testing GET /api/logs...")
        response = requests.get(f"{base_url}/api/logs", timeout=3)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    # Test 6: Mock endpoint
    try:
        print("\n✓ Testing GET /mock...")
        response = requests.get(f"{base_url}/mock", timeout=3)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    print("\n" + "="*60)
    print("✅ API Testing Complete")
    print("="*60)

if __name__ == "__main__":
    test_apis()
