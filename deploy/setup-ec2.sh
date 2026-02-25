#!/bin/bash
# ============================================================
# PAM — EC2 First-Time Setup Script
# รันครั้งเดียวบน EC2 (Ubuntu 24.04)
# IP: 54.254.222.207
# ============================================================

set -e

echo "🚀 Starting PAM EC2 Setup..."

# ── 1. Update system ─────────────────────────────────────
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ── 2. Install Nginx ─────────────────────────────────────
echo "🌐 Installing Nginx..."
sudo apt-get install -y nginx

# ── 3. Create web root ───────────────────────────────────
echo "📁 Creating web root..."
sudo mkdir -p /var/www/pam
sudo chown -R ubuntu:ubuntu /var/www/pam
sudo chmod -R 755 /var/www/pam

# ── 4. Nginx config for PAM ──────────────────────────────
echo "⚙️ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/pam > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;

    server_name _;  # รับทุก domain/IP

    root /var/www/pam;
    index page/home/main/pam.html;

    # Charset
    charset utf-8;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Main entry point
    location / {
        try_files $uri $uri/ /page/home/main/pam.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOF

# ── 5. Enable site ───────────────────────────────────────
sudo ln -sf /etc/nginx/sites-available/pam /etc/nginx/sites-enabled/pam
sudo rm -f /etc/nginx/sites-enabled/default

# ── 6. Test & start Nginx ────────────────────────────────
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo ""
echo "✅ Setup complete!"
echo "🌐 Server running at: http://54.254.222.207"
echo ""
echo "👉 Next step: Run deploy.ps1 from your Windows machine to upload files"
