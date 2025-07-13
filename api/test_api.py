#!/usr/bin/env python3
"""
Test script for Bayt AlSudani API endpoints
Usage: python test_api.py
"""

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
BASE_URL = "http://localhost:5000"
API_TOKEN = os.getenv('API_TOKEN', 'your-secret-api-token')
HEADERS = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_register():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    data = {
        "username": "testuser",
        "password": "testpass123",
        "email": "test@example.com",
        "fullName": "Test User",
        "phone": "123456789"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/register", 
                               headers=HEADERS, 
                               json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_login():
    """Test user login"""
    print("\n=== Testing User Login ===")
    data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/login", 
                               headers=HEADERS, 
                               json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            token = response.json().get('token')
            print(f"JWT Token: {token}")
            return token
    except Exception as e:
        print(f"Error: {e}")
    
    return None

def test_create_store():
    """Test store creation"""
    print("\n=== Testing Store Creation ===")
    data = {
        "name": "Test Store",
        "description": "A test store for API testing",
        "ownerId": 1,
        "category": "Electronics",
        "address": "123 Test Street",
        "phone": "987654321"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/stores", 
                               headers=HEADERS, 
                               json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_get_stores():
    """Test getting all stores"""
    print("\n=== Testing Get Stores ===")
    try:
        response = requests.get(f"{BASE_URL}/api/stores", headers=HEADERS)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def run_all_tests():
    """Run all API tests"""
    print("Starting Bayt AlSudani API Tests...")
    print("=" * 50)
    
    # Test health endpoint (no auth required)
    test_health()
    
    # Test authenticated endpoints
    test_register()
    test_login()
    test_create_store()
    test_get_stores()
    
    print("\n" + "=" * 50)
    print("API Tests Completed!")

if __name__ == "__main__":
    run_all_tests()