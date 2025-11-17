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
- **Redis Caching**: Performance optimization with Redis integration
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
- MongoDB
- Redis
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/nrbnayon/law_firm_portfolio_server.git
   cd law_firm_portfolio_server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database
   MONGODB_URI=mongodb://localhost:27017/law_firm_db

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_REFRESH_EXPIRES_IN=30d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@lawfirm.com

   # File Upload
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

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
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run prettier` | Format code with Prettier |
| `npm run prettier:fix` | Fix code formatting |
| `npm run docker:build` | Build Docker image |
| `npm run docker:dev` | Run development with Docker Compose |
| `npm run docker:prod` | Run production with Docker Compose |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | View Docker logs |

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users` - Get all users (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Attorneys
- `GET /api/v1/attorneys` - Get all attorneys
- `GET /api/v1/attorneys/:id` - Get attorney by ID
- `POST /api/v1/attorneys` - Create attorney (Admin)
- `PATCH /api/v1/attorneys/:id` - Update attorney (Admin)
- `DELETE /api/v1/attorneys/:id` - Delete attorney (Admin)

### Practice Areas
- `GET /api/v1/practice-areas` - Get all practice areas
- `GET /api/v1/practice-areas/:id` - Get practice area by ID
- `POST /api/v1/practice-areas` - Create practice area (Admin)
- `PATCH /api/v1/practice-areas/:id` - Update practice area (Admin)
- `DELETE /api/v1/practice-areas/:id` - Delete practice area (Admin)

### Insights
- `GET /api/v1/insights` - Get all insights
- `GET /api/v1/insights/:id` - Get insight by ID
- `POST /api/v1/insights` - Create insight (Admin)
- `PATCH /api/v1/insights/:id` - Update insight (Admin)
- `DELETE /api/v1/insights/:id` - Delete insight (Admin)

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - Get all contacts (Admin)
- `GET /api/v1/contact/:id` - Get contact by ID (Admin)
- `PATCH /api/v1/contact/:id` - Update contact status (Admin)
- `DELETE /api/v1/contact/:id` - Delete contact (Admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **Admin**: Full access to all resources
- **User**: Limited access to public resources

## 📦 Database Seeding

Run seeders to populate initial data:

```bash
# Seed admin user
npm run seed:admin

# Seed attorneys
npm run seed:attorneys

# Seed practice areas
npm run seed:practice-areas
```

## 🔄 Automated Jobs

The server runs scheduled jobs for:
- **File Cleanup**: Removes orphaned files from uploads directory
- **Token Cleanup**: Removes expired reset tokens

## 🐛 Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errorMessages": [
    {
      "path": "field_name",
      "message": "Detailed error message"
    }
  ],
  "stack": "Error stack (development only)"
}
```

## 📝 Logging

Logs are stored in the `logs/` directory:
- `combined/` - All logs
- `error/` - Error logs only
- `success/` - Success logs

## 🧪 Testing

```bash
npm test
```

## 🚀 Production Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**NRB Nayon**
- Email: nrbnayon@gmail.com
- GitHub: [@nrbnayon](https://github.com/nrbnayon)

## 🐛 Issues

Report issues at: [GitHub Issues](https://github.com/nrbnayon/backend-template/issues)

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- Redis for caching
- TypeScript for type safety
- All other open-source libraries used in this project

---

**Made with ❤️ by NRB Nayon**