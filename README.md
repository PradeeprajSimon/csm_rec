# Evently - Event Planner Application

A professional Event Planner application built with a React frontend and a Flask backend.

## 🚀 Local Setup

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on a port (usually `5173`).

---

## ☁️ AWS EC2 Deployment Guide (Free Tier)

Follow these steps to deploy your application to an AWS EC2 `t2.micro` instance.

### 1. Launch Instance
- Use **Ubuntu 22.04 LTS**.
- Select `t2.micro` (Free Tier eligible).
- **Security Groups**: Add rules for Port 80 (HTTP), Port 22 (SSH), and Port 5000 (Flask).

### 2. Configure Server
SSH into your instance:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

Install dependencies:
```bash
sudo apt update
sudo apt install -y python3-pip nodejs npm nginx
```

### 3. Deploy Backend
1. Clone your project or upload files.
2. Install Python requirements:
   ```bash
   pip3 install flask flask-cors gunicorn
   ```
3. Run with Gunicorn (production server):
   ```bash
   gunicorn --bind 0.0.0.0:5000 app:app
   ```

### 4. Deploy Frontend
1. Build the React app:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Move the build files to Nginx:
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```

### 5. Nginx Configuration
Edit the default config: `sudo nano /etc/nginx/sites-available/default`
```nginx
server {
    listen 80;
    server_name your_ec2_ip;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Restart Nginx:
```bash
sudo systemctl restart nginx
```

Now you can access your app via the EC2 Public IP!
