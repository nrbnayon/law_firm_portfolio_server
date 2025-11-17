# Law Firm Portfolio Server

A robust and scalable backend API for managing a law firm's portfolio, built with Express.js, MongoDB, Redis, and TypeScript.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Attorney Management**: Complete CRUD operations for attorney profiles
- **Practice Areas**: Manage and organize legal practice areas
- **Insights/Blog**: Content management system for legal insights and articles
- **Contact Management**: Handle client inquiries and contact submissions
- **File Upload**: Image and document upload with Sharp for optimization
- **Email Service**: Automated email notifications using Nodemailer
- **Redis Caching**: Performance optimization with Redis integration (optional)
- **Real-time Communication**: Socket.IO for real-time features
- **Database Seeding**: Pre-configured seeders for initial data setup
- **Automated Jobs**: Scheduled tasks for file cleanup and maintenance
- **Error Handling**: Centralized error handling with custom error classes
- **Request Validation**: Zod schema validation for API requests
- **Logging**: Winston logger with daily rotation for comprehensive logging
- **Docker Support**: Containerized deployment with Docker and Docker Compose

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)
- Redis (optional, can be disabled)
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Local Development

1. **Clone the repository**

   ```bash
   git clone git clone https://github.com/nrbnayon/law_firm_portfolio_server.git
   cd law_firm_portfolio_server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   IP_ADDRESS=127.0.0.1
   VERSION=1.0.0

   # Database - Use your MongoDB connection string
   DATABASE_URL=mongodb://localhost:27017/law_firm_db
   # or for MongoDB Atlas:
   # DATABASE_URL=mongodb

   # Redis (Optional - set DISABLE_REDIS=true to skip Redis)
   DISABLE_REDIS=false
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # JWT Configuration
   # Generate secure keys: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE_IN=30d
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   JWT_REFRESH_EXPIRES_IN=365d

   # Security
   BCRYPT_SALT_ROUNDS=12

   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@yourdomain.com

   # Admin Default Credentials
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=ChangeThisPassword123!

   # File Upload
   UPLOAD_FOLDER=./uploads
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp

   # Logging
   LOG_LEVEL=info

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Generate JWT Secrets**

   For production, generate secure random strings:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Setup Gmail for Email Service** (Optional)

   If using Gmail:
   - Enable 2-Factor Authentication on your Google account
   - Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Use the generated password in `EMAIL_PASS`

6. **Run the development server**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`

### Docker Deployment

1. **Development with Docker**

   ```bash
   npm run docker:dev
   ```

2. **Production with Docker**

   ```bash
   npm run docker:prod
   ```

3. **Stop Docker containers**

   ```bash
   npm run docker:down
   ```

4. **View Docker logs**
   ```bash
   npm run docker:logs
   ```

## 📁 Project Structure

```
src/
├── config/              # Configuration files (Redis, etc.)
├── database/            # Database connection and seeders
│   ├── migrations/      # Database migrations
│   └── seeders/         # Seed data for initial setup
├── features/            # Feature-based modules
│   ├── attorneys/       # Attorney management
│   ├── auth/            # Authentication & authorization
│   ├── contact/         # Contact form handling
│   ├── insights/        # Blog/insights management
│   ├── practice_areas/  # Practice areas management
│   ├── resetToken/      # Password reset tokens
│   └── user/            # User management
├── jobs/                # Scheduled jobs and cron tasks
├── routes/              # API route definitions
├── shared/              # Shared utilities and middleware
│   ├── email/           # Email templates and helpers
│   ├── enums/           # TypeScript enums
│   ├── errors/          # Custom error classes
│   ├── middlewares/     # Express middlewares
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── views/               # HTML templates
├── app.ts               # Express app configuration
└── server.ts            # Server entry point

uploads/                 # File uploads directory
├── images/              # Image uploads
│   ├── attorneys/       # Attorney profile images
│   └── practice/        # Practice area images
├── docs/                # Document uploads
└── medias/              # Media files

logs/                    # Application logs
├── combined/            # All logs
├── error/               # Error logs
└── success/             # Success logs
```

## 🔧 Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build TypeScript to JavaScript           |
| `npm start`            | Start production server                  |
| `npm run lint`         | Run ESLint                               |
| `npm run lint:fix`     | Fix ESLint errors                        |
| `npm run prettier`     | Format code with Prettier                |
| `npm run prettier:fix` | Fix code formatting                      |
| `npm run docker:build` | Build Docker image                       |
| `npm run docker:dev`   | Run development with Docker Compose      |
| `npm run docker:prod`  | Run production with Docker Compose       |
| `npm run docker:down`  | Stop Docker containers                   |
| `npm run docker:logs`  | View Docker logs                         |

## 📡 API Endpoints

### Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/logout` - User logout

### Users

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)
- `GET /api/v1/users/profile` - Get current user profile

### Attorneys

- `GET /api/v1/attorneys` - Get all attorneys (with pagination & search)
- `GET /api/v1/attorneys/:id` - Get attorney by ID
- `POST /api/v1/attorneys` - Create attorney (Admin only)
- `PATCH /api/v1/attorneys/:id` - Update attorney (Admin only)
- `DELETE /api/v1/attorneys/:id` - Delete attorney (Admin only)

### Practice Areas

- `GET /api/v1/practice-areas` - Get all practice areas
- `GET /api/v1/practice-areas/:id` - Get practice area by ID
- `POST /api/v1/practice-areas` - Create practice area (Admin only)
- `PATCH /api/v1/practice-areas/:id` - Update practice area (Admin only)
- `DELETE /api/v1/practice-areas/:id` - Delete practice area (Admin only)

### Insights (Blog)

- `GET /api/v1/insights` - Get all insights (with pagination & filters)
- `GET /api/v1/insights/:id` - Get insight by ID
- `POST /api/v1/insights` - Create insight (Admin only)
- `PATCH /api/v1/insights/:id` - Update insight (Admin only)
- `DELETE /api/v1/insights/:id` - Delete insight (Admin only)

### Contact

- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - Get all contacts (Admin only)
- `GET /api/v1/contact/:id` - Get contact by ID (Admin only)
- `PATCH /api/v1/contact/:id` - Update contact status (Admin only)
- `DELETE /api/v1/contact/:id` - Delete contact (Admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "your_password"
  }'
```

### Example Authenticated Request

```bash
curl -X GET http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer your_jwt_token"
```

### User Roles

- **Admin**: Full access to all resources
- **User**: Limited access to public resources

## 📦 Database Seeding

The application includes seeders for initial data:

- **Admin Seeder**: Creates default admin account
- **Attorney Seeder**: Populates sample attorneys
- **Practice Area Seeder**: Creates default practice areas

Seeders run automatically on first server start. To manually run:

```typescript
// In your code or create a seed script
import { seedAdmin } from "./database/seeders/seedAdmin";
import { seedAttorneys } from "./database/seeders/seedAttorney";
import { seedPracticeAreas } from "./database/seeders/seedPracticeArea";

// Run seeders
await seedAdmin();
await seedAttorneys();
await seedPracticeAreas();
```

## 🔄 Automated Jobs

The server runs scheduled background jobs:

### File Cleanup Job

- **Schedule**: Runs daily at 2:00 AM
- **Purpose**: Removes orphaned files from uploads directory
- **Location**: `src/jobs/autoFileCleanup.ts`

### Token Cleanup Job

- **Schedule**: Runs every 6 hours
- **Purpose**: Removes expired reset tokens from database
- **Location**: `src/jobs/cleanupJobs.ts`

## 📤 File Upload

### Configuration

```env
UPLOAD_FOLDER=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

### Upload Endpoint Example

```bash
curl -X POST http://localhost:5000/api/v1/attorneys \
  -H "Authorization: Bearer your_jwt_token" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "image=@/path/to/image.jpg"
```

### Supported File Types

- Images: JPEG, JPG, PNG, WebP
- Documents: PDF (can be configured)

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Other Email Providers

- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Configure your provider's settings

## 🐛 Error Handling

The API uses standardized error responses:

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorMessages": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ],
  "stack": "Error stack (development only)"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Logging

Logs are stored in the `logs/` directory with daily rotation:

### Log Types

- **Combined Logs**: `logs/combined/` - All application logs
- **Error Logs**: `logs/error/` - Error-level logs only
- **Success Logs**: `logs/success/` - Successful operations

### Log Levels

Configure via `LOG_LEVEL` environment variable:

- `error` - Error messages only
- `warn` - Warnings and errors
- `info` - General information (default)
- `debug` - Detailed debugging information

### Log Format

```
2025-11-17 10:30:45 [info]: Server started on port 5000
2025-11-17 10:31:20 [error]: Database connection failed: Connection timeout
```

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (Atlas recommended)
- Redis instance (optional)
- Domain name with SSL certificate

### Deployment Steps

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Set production environment**

   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your_production_mongodb_url
   JWT_SECRET=your_production_secret
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start dist/server.js --name "law-firm-api"
pm2 startup
pm2 save
```

### Using Docker

```bash
docker build -t law-firm-api .
docker run -d -p 5000:5000 --env-file .env law-firm-api
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file to version control
2. **JWT Secrets**: Use strong, random secrets (64+ characters)
3. **Password Hashing**: bcrypt with 12 salt rounds minimum
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **CORS**: Configure specific origins, not wildcard `*`
6. **HTTPS**: Always use HTTPS in production
7. **Input Validation**: All inputs validated with Zod schemas
8. **SQL Injection**: Using Mongoose ORM prevents injection attacks
9. **File Upload**: Validate file types and sizes
10. **Dependency Updates**: Regularly update dependencies

## 🧪 Testing

```bash
npm test
```

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/           # End-to-end tests
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Run linter before committing: `npm run lint:fix`

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**NRB Nayon**

- Email: nrbnayon@gmail.com
- GitHub: [@nrbnayon](https://github.com/nrbnayon)
- Project Link: [https://github.com/nrbnayon/backend-template](https://github.com/nrbnayon/backend-template)

## 🐛 Support

For support and bug reports:

- **GitHub Issues**: [Report Issues](https://github.com/nrbnayon/backend-template/issues)
- **Email**: nrbnayon@gmail.com

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible NoSQL database
- Redis for high-performance caching
- TypeScript for type safety and better developer experience
- All open-source contributors and libraries used in this project

---

**Made with ❤️ by NRB Nayon** | © 2025 Law Firm Portfolio Server
