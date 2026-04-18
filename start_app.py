import subprocess
import time
import sys
import os

def start_app():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, 'backend')
    frontend_dir = os.path.join(root_dir, 'frontend')

    print("🚀 Starting Evently App...")

    # 1. Start Backend
    print("📂 Starting Flask Backend on port 5000...")
    backend_process = subprocess.Popen(
        [sys.executable, 'app.py'],
        cwd=backend_dir
    )

    # Give backend a moment to start
    time.sleep(2)

    # 2. Start Frontend
    print("💻 Starting React Frontend...")
    try:
        frontend_process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            cwd=frontend_dir,
            shell=True
        )
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        backend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    start_app()
