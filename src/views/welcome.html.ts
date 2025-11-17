// src/views/profile.html.ts
// This file exports the HTML as a string
export const profileHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Law Portfolio - Server Status</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
   
    :root {
      --primary: #c5a05e;
      --primary-dark: #a68749;
      --primary-light: #f5eee0;
      --dark: #1a1a1a;
      --dark-secondary: #2d2d2d;
      --text: #333333;
      --text-light: #666666;
      --white: #ffffff;
      --success: #10b981;
      --error: #ef4444;
      --border: #e5e5e5;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      min-height: 100vh;
      padding: 20px;
      color: var(--text);
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: var(--white);
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header Section */
    .header {
      background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 100%);
      color: var(--white);
      padding: 50px 40px;
      position: relative;
      overflow: hidden;
      border-bottom: 4px solid var(--primary);
    }

    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: rgba(197, 160, 94, 0.1);
      border-radius: 50%;
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(180deg); }
    }

    .header-content { 
      position: relative; 
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-left {
      flex: 1;
      min-width: 300px;
    }

    .header h1 {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -1px;
      color: var(--primary);
    }

    .header .subtitle {
      font-size: 20px;
      opacity: 0.9;
      font-weight: 400;
      margin-bottom: 20px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(16, 185, 129, 0.15);
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      border: 2px solid var(--success);
      color: var(--success);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 0 0 10px var(--success);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.3); }
    }

    /* Server Status Section */
    .server-section {
      padding: 50px 40px;
      background: linear-gradient(to bottom, #f8f9fa, #ffffff);
      border-bottom: 1px solid var(--border);
    }

    .section-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .section-icon {
      width: 50px;
      height: 50px;
      background: var(--primary-light);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .section-description {
      font-size: 16px;
      color: var(--text-light);
      margin-bottom: 30px;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .status-card {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--white);
      padding: 30px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(197, 160, 94, 0.2);
    }

    .status-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(197, 160, 94, 0.3);
    }

    .status-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .status-card:hover::before {
      transform: scale(1.5);
    }

    .status-card-label {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-card-value {
      font-size: 16px;
      font-weight: 600;
      word-break: break-all;
      position: relative;
      z-index: 1;
      line-height: 1.4;
    }

    /* Developer Section */
    .developer-section {
      padding: 50px 40px;
      background: var(--white);
    }

    .developer-card {
      background: linear-gradient(to bottom right, #f8f9fa, #e9ecef);
      border-radius: 20px;
      padding: 40px;
      border: 2px solid var(--border);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 30px;
    }

    .developer-info {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .info-card {
      background: var(--white);
      padding: 20px 25px;
      border-radius: 12px;
      border-left: 4px solid var(--primary);
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .info-card:hover {
      transform: translateX(8px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .info-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .info-value {
      font-size: 16px;
      color: var(--dark);
      font-weight: 600;
    }

    .info-value a {
      color: var(--primary);
      text-decoration: none;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .info-value a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .developer-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
      justify-content: center;
    }

    .action-btn {
      padding: 16px 28px;
      background: var(--white);
      border: 2px solid var(--primary);
      color: var(--primary);
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .action-btn:hover {
      background: var(--primary);
      color: var(--white);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(197, 160, 94, 0.3);
    }

    .action-btn-icon {
      font-size: 20px;
    }

    /* Footer */
    .footer {
      padding: 30px 40px;
      background: var(--dark);
      color: var(--white);
      text-align: center;
      font-size: 14px;
    }

    .footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--dark);
      color: var(--white);
      padding: 18px 28px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      display: none;
      align-items: center;
      gap: 15px;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
      max-width: 400px;
    }

    @keyframes slideInRight {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast.show { display: flex; }
    .toast.success { 
      background: var(--success);
      border-left: 4px solid #059669;
    }
    .toast.error { 
      background: var(--error);
      border-left: 4px solid #dc2626;
    }

    .toast-icon {
      font-size: 24px;
    }

    .toast-content {
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .toast-message {
      font-size: 13px;
      opacity: 0.9;
    }

    /* Responsive Design */
    @media (max-width: 968px) {
      .developer-card {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    @media (max-width: 768px) {
      body { padding: 10px; }
      .container { border-radius: 16px; }
      
      .header { padding: 40px 25px; }
      .header h1 { font-size: 36px; }
      .header .subtitle { font-size: 16px; }
      .header-content { flex-direction: column; align-items: flex-start; }
      
      .server-section, .developer-section { padding: 35px 25px; }
      .section-title { font-size: 26px; }
      
      .status-grid { grid-template-columns: 1fr; }
      
      .developer-card { padding: 25px; }
      
      .toast { 
        bottom: 20px; 
        right: 20px; 
        left: 20px;
        max-width: none;
      }
    }

    /* Loading Animation */
    .loading {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: var(--white);
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>Law Portfolio</h1>
          <p class="subtitle">Professional Legal Services Backend API</p>
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>Server Online & Running</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Server Status Section -->
    <section class="server-section">
      <div class="section-title">
        <div class="section-icon">🖥️</div>
        Server Status
      </div>
      <p class="section-description">
        Real-time server information and API endpoints
      </p>
      
      <div class="status-grid">
        <div class="status-card" onclick="copyToClipboard(window.location.origin + '/api/v1', 'API Endpoint')">
          <div class="status-card-label">🔗 API Endpoint</div>
          <div class="status-card-value" id="api-endpoint">Loading...</div>
        </div>
        
        <div class="status-card" onclick="checkHealth()">
          <div class="status-card-label">💚 Health Check</div>
          <div class="status-card-value">Click to Test Server</div>
        </div>
        
        <div class="status-card" onclick="copyToClipboard(window.location.origin + '/api/v1/health', 'Health Endpoint')">
          <div class="status-card-label">🏥 Health Endpoint</div>
          <div class="status-card-value" id="health-endpoint">Loading...</div>
        </div>
        
        <div class="status-card" onclick="window.open(window.location.origin + '/api/v1/health', '_blank')">
          <div class="status-card-label">📊 Server Uptime</div>
          <div class="status-card-value">View Live Status</div>
        </div>
      </div>
    </section>

    <!-- Developer Section -->
    <section class="developer-section">
      <div class="section-title">
        <div class="section-icon">👨‍💻</div>
        Developer Information
      </div>
      <p class="section-description">
        Backend developed and maintained by Nayon Kanti Halder
      </p>

      <div class="developer-card">
        <div class="developer-info">
          <div class="info-card">
            <div class="info-label">👤 Full Name</div>
            <div class="info-value">Nayon Kanti Halder</div>
          </div>
          
          <div class="info-card">
            <div class="info-label">💼 Role</div>
            <div class="info-value">Full Stack Developer | MERN Specialist</div>
          </div>
          
          <div class="info-card">
            <div class="info-label">📧 Email</div>
            <div class="info-value">
              <a href="mailto:nrbnayon@gmail.com">
                nrbnayon@gmail.com →
              </a>
            </div>
          </div>
          
          <div class="info-card">
            <div class="info-label">📱 Phone</div>
            <div class="info-value">
              <a href="tel:01934025581">
                +880 1934-025581 →
              </a>
            </div>
          </div>
        </div>

        <div class="developer-actions">
          <a href="https://github.com/nrbnayon" target="_blank" class="action-btn">
            <span class="action-btn-icon">🐙</span>
            <span>View GitHub Profile</span>
          </a>
          
          <a href="https://www.linkedin.com/in/itsnayon" target="_blank" class="action-btn">
            <span class="action-btn-icon">💼</span>
            <span>Connect on LinkedIn</span>
          </a>
          
          <a href="https://nayon-ii.vercel.app/" target="_blank" class="action-btn">
            <span class="action-btn-icon">🌐</span>
            <span>Visit Portfolio Website</span>
          </a>
          
          <a href="mailto:nrbnayon@gmail.com" class="action-btn">
            <span class="action-btn-icon">📬</span>
            <span>Send Email</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <div class="footer">
      <p>Law Portfolio API Server © 2025 | Developed by <a href="https://nayon-ii.vercel.app/" target="_blank">Nayon Kanti Halder</a></p>
      <p style="margin-top: 8px; opacity: 0.8;">MERN Stack | Node.js | Express | MongoDB | TypeScript</p>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" id="toast">
    <span class="toast-icon" id="toast-icon">✓</span>
    <div class="toast-content">
      <div class="toast-title" id="toast-title">Success</div>
      <div class="toast-message" id="toast-message"></div>
    </div>
  </div>

  <script>
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      const apiEndpoint = document.getElementById('api-endpoint');
      const healthEndpoint = document.getElementById('health-endpoint');
      
      if (apiEndpoint) {
        apiEndpoint.textContent = window.location.origin + '/api/v1';
      }
      
      if (healthEndpoint) {
        healthEndpoint.textContent = window.location.origin + '/api/v1/health';
      }

      // Auto health check on load
      setTimeout(() => {
        fetch(window.location.origin + '/api/v1/health')
          .then(response => response.json())
          .then(data => {
            console.log('✅ Server Status:', data);
          })
          .catch(err => {
            console.log('❌ Health check failed:', err);
          });
      }, 1000);
    });

    // Show toast notification
    function showToast(title, message, type = 'success') {
      const toast = document.getElementById('toast');
      const toastIcon = document.getElementById('toast-icon');
      const toastTitle = document.getElementById('toast-title');
      const toastMessage = document.getElementById('toast-message');
      
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      
      if (type === 'success') {
        toastIcon.textContent = '✓';
      } else if (type === 'error') {
        toastIcon.textContent = '✕';
      } else {
        toastIcon.textContent = 'ℹ';
      }
      
      toast.className = \`toast \${type} show\`;
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    // Copy to clipboard
    function copyToClipboard(text, label) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(
          'Copied Successfully!', 
          \`\${label} has been copied to clipboard\`, 
          'success'
        );
      }).catch(() => {
        showToast(
          'Copy Failed', 
          'Unable to copy to clipboard', 
          'error'
        );
      });
    }

    // Health check
    function checkHealth() {
      showToast('Checking...', 'Testing server health status', 'success');
      
      const startTime = Date.now();
      
      fetch(window.location.origin + '/api/v1/health')
        .then(response => response.json())
        .then(data => {
          const responseTime = Date.now() - startTime;
          const uptimeMinutes = Math.floor(data.uptime / 60);
          const uptimeSeconds = Math.floor(data.uptime % 60);
          
          showToast(
            'Server is Healthy! ✅', 
            \`Response time: \${responseTime}ms | Uptime: \${uptimeMinutes}m \${uptimeSeconds}s\`, 
            'success'
          );
        })
        .catch(error => {
          showToast(
            'Health Check Failed ❌', 
            'Unable to connect to server', 
            'error'
          );
        });
    }
  </script>
</body>
</html>`;

// <div class="info-card">
//   <div class="info-label">Location</div>
//   <div class="info-value">Vatara, Dhaka-1212, Bangladesh</div>
// </div>
