├── 📁 src
│   ├── 📁 common
│   │   ├── 📁 decorators
│   │   │   └── 📄 roles.decorator.ts
│   │   ├── 📁 filters
│   │   │   └── 📄 http-exception.filter.ts
│   │   ├── 📁 guards
│   │   │   ├── 📄 jwt-auth.guard.ts
│   │   │   ├── 📄 roles.guard.ts
│   │   │   └── 📄 subscription.guard.ts
│   │   ├── 📁 services
│   │   │   └── 📄 storage.service.ts
│   │   └── 📄 common.module.ts
│   ├── 📁 config
│   │   ├── 📄 database.config.ts
│   │   └── 📄 jwt.config.ts
│   ├── 📁 database
│   │   ├── 📁 schemas
│   │   │   ├── 📄 document.schema.ts
│   │   │   ├── 📄 subscription.schema.ts
│   │   │   └── 📄 user.schema.ts
│   │   └── 📁 seeds
│   │       └── 📄 admin.seed.ts
│   ├── 📁 modules
│   │   ├── 📁 admin
│   │   │   ├── 📄 admin.controller.spec.ts
│   │   │   ├── 📄 admin.controller.ts
│   │   │   ├── 📄 admin.module.ts
│   │   │   └── 📄 admin.service.ts
│   │   ├── 📁 applications
│   │   │   ├── 📁 dto
│   │   │   │   ├── 📄 create-application.dto.ts
│   │   │   │   └── 📄 update-application.dto.ts
│   │   │   ├── 📁 schemas
│   │   │   │   └── 📄 application.schema.ts
│   │   │   ├── 📄 applications.controller.spec.ts
│   │   │   ├── 📄 applications.controller.ts
│   │   │   ├── 📄 applications.module.ts
│   │   │   └── 📄 applications.service.ts
│   │   ├── 📁 auth
│   │   │   ├── 📁 dto
│   │   │   │   ├── 📄 forgot-password.dto.ts
│   │   │   │   ├── 📄 login.dto.ts
│   │   │   │   ├── 📄 refresh-token.dto.ts
│   │   │   │   ├── 📄 register-company.dto.ts
│   │   │   │   ├── 📄 register-driver.dto.ts
│   │   │   │   ├── 📄 reset-password.dto.ts
│   │   │   │   └── 📄 verify-email.dto.ts
│   │   │   ├── 📁 strategies
│   │   │   │   └── 📄 jwt.strategy.ts
│   │   │   ├── 📄 auth.controller.spec.ts
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.module.ts
│   │   │   └── 📄 auth.service.ts
│   │   ├── 📁 companies
│   │   │   ├── 📁 dto
│   │   │   ├── 📁 schemas
│   │   │   ├── 📄 companies.controller.ts
│   │   │   ├── 📄 companies.module.ts
│   │   │   └── 📄 companies.service.ts
│   │   ├── 📁 documents
│   │   │   ├── 📁 dto
│   │   │   ├── 📄 documents.module.ts
│   │   │   └── 📄 documents.service.ts
│   │   ├── 📁 email
│   │   │   ├── 📄 email.module.ts
│   │   │   └── 📄 email.service.ts
│   │   ├── 📁 missions
│   │   │   ├── 📁 dto
│   │   │   │   ├── 📄 create-mission.dto.ts
│   │   │   │   └── 📄 update-mission.dto.ts
│   │   │   ├── 📁 schemas
│   │   │   │   └── 📄 mission.schema.ts
│   │   │   ├── 📄 missions.controller.spec.ts
│   │   │   ├── 📄 missions.controller.ts
│   │   │   ├── 📄 missions.module.ts
│   │   │   └── 📄 missions.service.ts
│   │   ├── 📁 subscriptions
│   │   │   ├── 📁 dto
│   │   │   │   └── 📄 create-checkout.dto.ts
│   │   │   ├── 📄 subscriptions.controller.spec.ts
│   │   │   ├── 📄 subscriptions.controller.ts
│   │   │   ├── 📄 subscriptions.module.ts
│   │   │   └── 📄 subscriptions.service.ts
│   │   └── 📁 users
│   │       ├── 📁 dto
│   │       │   ├── 📄 update-company-profile.dto.ts
│   │       │   └── 📄 update-driver-profile.dto.ts
│   │       ├── 📁 schemas
│   │       ├── 📄 users.controller.spec.ts
│   │       ├── 📄 users.controller.ts
│   │       ├── 📄 users.module.ts
│   │       └── 📄 users.service.ts
│   ├── 📁 utils
│   │   └── 📄 hashing.ts
│   ├── 📄 app.controller.spec.ts
│   ├── 📄 app.controller.ts
│   ├── 📄 app.module.ts
│   ├── 📄 app.service.ts
│   ├── 📄 files.controller.ts
│   └── 📄 main.ts
├── 📁 test
│   ├── 📁 e2e
│   │   ├── 📄 admin.e2e-spec.ts
│   │   ├── 📄 company.e2e-spec.ts
│   │   └── 📄 driver.e2e-spec.ts
│   ├── 📁 helpers
│   │   └── 📄 db.helper.ts
│   ├── 📁 integration
│   │   └── 📄 auth.integration-spec.ts
│   ├── 📄 app.e2e-spec.ts
│   ├── ⚙️ jest-e2e.json
│   └── ⚙️ jest-integration.json
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── ⚙️ .prettierrc
├── 📝 README.md
├── 📄 eslint.config.mjs
├── ⚙️ nest-cli.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json