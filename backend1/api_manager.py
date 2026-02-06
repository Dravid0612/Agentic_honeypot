import subprocess
import threading
import time
import sys
import os

def run_flask_api():
    """Run Flask API on port 5001"""
    print("\n" + "="*70)
    print("🚀 STARTING FLASK API (Port: 5001)")
    print("="*70)
    
    try:
        # Run flask API
        subprocess.run([sys.executable, "safe_api_flask.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Flask API stopped")
    except Exception as e:
        print(f"❌ Flask API error: {e}")

def run_simple_api():
    """Run Simple HTTP API on port 5002"""
    print("\n" + "="*60)
    print("⚡ STARTING SIMPLE API (Port: 5002)")
    print("="*60)
    
    try:
        # Run simple API
        subprocess.run([sys.executable, "safe_api_simple.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Simple API stopped")
    except Exception as e:
        print(f"❌ Simple API error: {e}")

def check_dependencies():
    """Check if Flask is installed"""
    try:
        import flask
        print("✅ Flask is installed")
        return True
    except ImportError:
        print("⚠️  Flask not installed. Simple API only.")
        return False

def main():
    print("\n" + "="*80)
    print("🛡️  AGENTIC HONEYPOT - DUAL API TESTING SYSTEM")
    print("="*80)
    
    flask_available = check_dependencies()
    
    print("\n📊 SYSTEM OVERVIEW:")
    print(f"  • Flask API:    {'Available' if flask_available else 'Not Available'} (Port: 5001)")
    print(f"  • Simple API:   Always Available (Port: 5002)")
    print(f"  • Frontend:     http://localhost:3000")
    print("\n🎯 CHOOSE MODE:")
    print("  1. Both APIs (Recommended)")
    print("  2. Flask API only (Feature-rich)")
    print("  3. Simple API only (No dependencies)")
    print("  4. Exit")
    
    choice = input("\nSelect mode (1-4): ").strip()
    
    if choice == '1' and flask_available:
        # Run both in threads
        flask_thread = threading.Thread(target=run_flask_api, daemon=True)
        simple_thread = threading.Thread(target=run_simple_api, daemon=True)
        
        flask_thread.start()
        time.sleep(2)  # Give Flask a head start
        simple_thread.start()
        
        print("\n✅ Both APIs running!")
        print("  • Flask API:  http://localhost:5001")
        print("  • Simple API: http://localhost:5002")
        print("\n🔄 Press Ctrl+C twice to stop both servers")
        
        try:
            flask_thread.join()
            simple_thread.join()
        except KeyboardInterrupt:
            print("\n👋 Shutting down both APIs...")
            
    elif choice == '2' and flask_available:
        run_flask_api()
    elif choice == '3':
        run_simple_api()
    elif choice == '4':
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice or Flask not available")
        if not flask_available:
            print("💡 Install Flask: pip install flask flask-cors")
            print("   Then run: python api_manager.py")

if __name__ == '__main__':
    main()