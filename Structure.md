# File Tree: law_firm_portfolio_server

```
├── 📁 logs
│   ├── 📁 combined
│   │   ├── ⚙️ .8ffe448e30c422fde595ac083c56e51949583420-audit.json
│   │   └── ⚙️ .94c7f35708af770a1e07d40cc6fbd5ddb0d97cc4-audit.json
│   ├── 📁 error
│   │   ├── ⚙️ .10ea5b2cdca810481b4a0665e1afd124f2a187af-audit.json
│   │   └── ⚙️ .fd5db2471448b01d8280dbd936ad41f36632c33f-audit.json
│   └── 📁 success
│       ├── ⚙️ .4eea205b6b97e3ce63fdad1871e86716e1f263af-audit.json
│       └── ⚙️ .b490a2aecc9eff6d61b5b8e81e7f9018bbcc575a-audit.json
├── 📁 src
│   ├── 📁 config
│   │   ├── 📄 index.ts
│   │   └── 📄 redis.config.ts
│   ├── 📁 database
│   │   ├── 📁 migrations
│   │   ├── 📁 seeders
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 seedAdmin.ts
│   │   │   ├── 📄 seedAttorney.ts
│   │   │   └── 📄 seedPracticeArea.ts
│   │   └── 📄 connection.ts
│   ├── 📁 features
│   │   ├── 📁 attorneys
│   │   │   ├── 📄 attorney.controller.ts
│   │   │   ├── 📄 attorney.interface.ts
│   │   │   ├── 📄 attorney.model.ts
│   │   │   ├── 📄 attorney.route.ts
│   │   │   ├── 📄 attorney.service.ts
│   │   │   └── 📄 attorney.validation.ts
│   │   ├── 📁 auth
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.lib.ts
│   │   │   ├── 📄 auth.route.ts
│   │   │   ├── 📄 auth.service.ts
│   │   │   └── 📄 auth.validation.ts
│   │   ├── 📁 contact
│   │   │   ├── 📄 contact.controller.ts
│   │   │   ├── 📄 contact.interface.ts
│   │   │   ├── 📄 contact.model.ts
│   │   │   ├── 📄 contact.route.ts
│   │   │   ├── 📄 contact.service.ts
│   │   │   └── 📄 contact.validation.ts
│   │   ├── 📁 insights
│   │   │   ├── 📄 insight.controller.ts
│   │   │   ├── 📄 insight.interface.ts
│   │   │   ├── 📄 insight.model.ts
│   │   │   ├── 📄 insight.route.ts
│   │   │   ├── 📄 insight.service.ts
│   │   │   └── 📄 insight.validation.ts
│   │   ├── 📁 practice_areas
│   │   │   ├── 📄 practiceArea.controller.ts
│   │   │   ├── 📄 practiceArea.interface.ts
│   │   │   ├── 📄 practiceArea.model.ts
│   │   │   ├── 📄 practiceArea.route.ts
│   │   │   ├── 📄 practiceArea.service.ts
│   │   │   └── 📄 practiceArea.validation.ts
│   │   ├── 📁 resetToken
│   │   │   ├── 📄 resetToken.interface.ts
│   │   │   └── 📄 resetToken.model.ts
│   │   └── 📁 user
│   │       ├── 📄 user.constants.ts
│   │       ├── 📄 user.controller.ts
│   │       ├── 📄 user.interface.ts
│   │       ├── 📄 user.model.ts
│   │       ├── 📄 user.route.ts
│   │       ├── 📄 user.service.ts
│   │       └── 📄 user.validation.ts
│   ├── 📁 jobs
│   │   ├── 📄 autoFileCleanup.ts
│   │   └── 📄 cleanupJobs.ts
│   ├── 📁 routes
│   │   └── 📄 index.ts
│   ├── 📁 shared
│   │   ├── 📁 email
│   │   │   ├── 📄 emailHelper.ts
│   │   │   └── 📄 emailTemplate.ts
│   │   ├── 📁 enums
│   │   │   └── 📄 user.ts
│   │   ├── 📁 errors
│   │   │   ├── 📄 ApiError.ts
│   │   │   ├── 📄 AppError.ts
│   │   │   ├── 📄 handleCastError.ts
│   │   │   ├── 📄 handleDuplicateError.ts
│   │   │   ├── 📄 handleValidationError.ts
│   │   │   └── 📄 handleZodError.ts
│   │   ├── 📁 middlewares
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 checkSubscriptionExpiry.ts
│   │   │   ├── 📄 fileUploadHandler.ts
│   │   │   ├── 📄 globalErrorHandler.ts
│   │   │   ├── 📄 notFoundRoute.ts
│   │   │   └── 📄 validateRequest.ts
│   │   ├── 📁 types
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 email.ts
│   │   │   ├── 📄 error.ts
│   │   │   └── 📄 pagination.ts
│   │   └── 📁 utils
│   │       ├── 📄 QueryBuilder.ts
│   │       ├── 📄 catchAsync.ts
│   │       ├── 📄 fileManager.ts
│   │       ├── 📄 generateOTP.ts
│   │       ├── 📄 jwtHelper.ts
│   │       ├── 📄 logger.ts
│   │       ├── 📄 morgen.ts
│   │       └── 📄 sendResponse.ts
│   ├── 📁 views
│   │   └── 📄 welcome.html.ts
│   ├── 📄 app.ts
│   └── 📄 server.ts
├── 📁 uploads
│   ├── 📁 docs
│   ├── 📁 images
│   │   ├── 📁 attorneys
│   │   └── 📁 practice
├── ⚙️ .eslintignore
├── ⚙️ .eslintrc
├── ⚙️ .gitignore
├── 🐳 Dockerfile
├── ⚙️ docker-compose.yml
├── ⚙️ nginx.conf
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json
```

