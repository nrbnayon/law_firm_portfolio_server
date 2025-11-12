// Step 1: Create src/views/profile.html.ts
// This file exports the HTML as a string

export const profileHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nayon Kanti Halder - Full Stack Developer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --primary: #10b981;
      --primary-dark: #059669;
      --primary-light: #d1fae5;
      --dark: #0f172a;
      --text: #334155;
      --text-light: #64748b;
      --white: #ffffff;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: var(--text);
      line-height: 1.6;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: var(--white);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: var(--white);
      padding: 60px 40px;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .header-content { position: relative; z-index: 1; }

    .header h1 {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: -1px;
    }

    .header .subtitle {
      font-size: 18px;
      opacity: 0.95;
      font-weight: 400;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 50px;
      margin-top: 20px;
      font-size: 14px;
      backdrop-filter: blur(10px);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }

    .quick-actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      padding: 30px 40px;
      background: linear-gradient(to right, #f8fafc, #e0f2fe);
      border-bottom: 1px solid #e2e8f0;
    }

    .action-btn {
      flex: 1;
      min-width: 140px;
      padding: 12px 20px;
      background: var(--white);
      border: 2px solid var(--primary);
      color: var(--primary);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .action-btn:hover {
      background: var(--primary);
      color: var(--white);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }

    section {
      padding: 40px;
      border-bottom: 1px solid #e2e8f0;
      animation: fadeIn 0.6s ease forwards;
      opacity: 0;
    }

    section:nth-child(2) { animation-delay: 0.1s; }
    section:nth-child(3) { animation-delay: 0.2s; }

    @keyframes fadeIn { to { opacity: 1; } }

    section:last-child { border-bottom: none; }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .section-icon {
      width: 40px;
      height: 40px;
      background: var(--primary-light);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--dark);
    }

    .server-status {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .status-card {
      flex: 1;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: var(--white);
      padding: 20px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .status-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }

    .status-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: translate(30%, -30%);
    }

    .status-card-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }

    .status-card-value {
      font-size: 14px;
      font-weight: 600;
      word-break: break-all;
      position: relative;
      z-index: 1;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .info-card {
      background: #f8fafc;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid var(--primary);
      transition: all 0.3s ease;
    }

    .info-card:hover {
      transform: translateX(5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    }

    .info-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }

    .info-value {
      font-size: 15px;
      color: var(--dark);
      font-weight: 500;
    }

    .info-value a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.3s;
    }

    .info-value a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--dark);
      color: var(--white);
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      display: none;
      align-items: center;
      gap: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast.show { display: flex; }
    .toast.success { background: var(--primary); }
    .toast.error { background: #ef4444; }

    @media (max-width: 768px) {
      body { padding: 10px; }
      .container { border-radius: 16px; }
      .header { padding: 40px 30px; }
      .header h1 { font-size: 32px; }
      section { padding: 30px 20px; }
      .quick-actions { padding: 20px; }
      .action-btn { min-width: 100%; }
      .server-status { flex-direction: column; }
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>Nayon Kanti Halder</h1>
        <p class="subtitle">Full Stack Developer | MERN Stack Specialist | AI Integration Expert</p>
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>Server is Running</span>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <a href="mailto:nrbnayon@gmail.com" class="action-btn">
        <span>📧</span> Email Me
      </a>
      <a href="https://github.com/nrbnayon" target="_blank" class="action-btn">
        <span>🐙</span> GitHub
      </a>
      <a href="https://www.linkedin.com/in/nrbnayon" target="_blank" class="action-btn">
        <span>💼</span> LinkedIn
      </a>
      <a href="https://nrbnayon.vercel.app" target="_blank" class="action-btn">
        <span>🌐</span> Portfolio
      </a>
    </div>

    <section>
      <div class="section-header">
        <div class="section-icon">🖥️</div>
        <h2>Server Information</h2>
      </div>
      <div class="server-status">
        <div class="status-card" onclick="copyToClipboard(window.location.origin + '/api/v1', 'API Endpoint')">
          <div class="status-card-label">API Endpoint</div>
          <div class="status-card-value" id="api-endpoint">Loading...</div>
        </div>
        <div class="status-card" onclick="checkHealth()">
          <div class="status-card-label">Health Check</div>
          <div class="status-card-value">Click to Test Server</div>
        </div>
      </div>
    </section>

    <section>
      <div class="section-header">
        <div class="section-icon">👤</div>
        <h2>Contact Information</h2>
      </div>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Full Name</div>
          <div class="info-value">Nayon Kanti Halder</div>
        </div>
        <div class="info-card">
          <div class="info-label">Phone</div>
          <div class="info-value"><a href="tel:01934025581">01934025581</a></div>
        </div>
        <div class="info-card">
          <div class="info-label">Email</div>
          <div class="info-value"><a href="mailto:nrbnayon@gmail.com">nrbnayon@gmail.com</a></div>
        </div>
        <div class="info-card">
          <div class="info-label">Location</div>
          <div class="info-value">Vatara, Dhaka-1212, Bangladesh</div>
        </div>
      </div>
    </section>
  </div>

  <div class="toast" id="toast">
    <span id="toast-message"></span>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const apiEndpoint = document.getElementById('api-endpoint');
      if (apiEndpoint) {
        apiEndpoint.textContent = window.location.origin + '/api/v1';
      }
    });

    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      const toastMessage = document.getElementById('toast-message');
      
      toastMessage.textContent = message;
      toast.className = \`toast \${type} show\`;
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    function copyToClipboard(text, label) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(\`\${label} copied to clipboard!\`, 'success');
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
    }

    function checkHealth() {
      showToast('Checking server health...', 'success');
      
      fetch(window.location.origin + '/api/v1/health')
        .then(response => response.json())
        .then(data => {
          showToast(\`Server is healthy! Uptime: \${Math.floor(data.uptime)}s ✅\`, 'success');
        })
        .catch(error => {
          showToast('Server health check failed', 'error');
        });
    }

    setTimeout(() => {
      fetch(window.location.origin + '/api/v1/health')
        .then(response => response.json())
        .then(data => console.log('Server Status:', data))
        .catch(err => console.log('Health check failed:', err));
    }, 1000);
  </script>
</body>
</html>`;

