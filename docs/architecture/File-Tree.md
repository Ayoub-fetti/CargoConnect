
├── 📁 .github/
│   └── 📁 workflows/
│       ├── ⚙️ api.yml
│       ├── ⚙️ tests.yml
│       └── ⚙️ web.yml
├── 📁 apps/
│   ├── 📁 api/
│   │   ├── 📁 src/
│   │   │   ├── 📁 common/
│   │   │   │   ├── 📁 constants/
│   │   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📁 filters/
│   │   │   │   ├── 📁 guards/
│   │   │   │   ├── 📁 interceptors/
│   │   │   │   └── 📁 pipes/
│   │   │   ├── 📁 config/
│   │   │   │   ├── 📄 app.config.ts
│   │   │   │   ├── 📄 database.config.ts
│   │   │   │   └── 📄 jwt.config.ts
│   │   │   ├── 📁 database/
│   │   │   │   ├── 📁 migrations/
│   │   │   │   └── 📁 schemas/
│   │   │   ├── 📁 modules/
│   │   │   │   ├── 📁 applications/
│   │   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📁 strategies/
│   │   │   │   │   ├── 📄 applications.controller.ts
│   │   │   │   │   ├── 📄 applications.module.ts
│   │   │   │   │   └── 📄 applications.service.ts
│   │   │   │   ├── 📁 auth/
│   │   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📁 strategies/
│   │   │   │   │   ├── 📄 auth.controller.ts
│   │   │   │   │   ├── 📄 auth.module.ts
│   │   │   │   │   └── 📄 auth.service.ts
│   │   │   │   ├── 📁 documents/
│   │   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📄 documents.module.ts
│   │   │   │   │   └── 📄 documents.service.ts
│   │   │   │   ├── 📁 drivers/
│   │   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📁 schemas/
│   │   │   │   │   ├── 📄 companies.controller.ts
│   │   │   │   │   ├── 📄 companies.module.ts
│   │   │   │   │   └── 📄 companies.service.ts
│   │   │   │   ├── 📁 missions/
│   │   │   │   │   ├── 📁 dto/
│   │   │   │   │   ├── 📁 schemas/
│   │   │   │   │   ├── 📄 missions.controller.ts
│   │   │   │   │   ├── 📄 missions.module.ts
│   │   │   │   │   └── 📄 missions.service.ts
│   │   │   │   ├── 📁 payments/
│   │   │   │   │   ├── 📄 payments.module.ts
│   │   │   │   │   └── 📄 payments.service.ts
│   │   │   │   ├── 📁 subscriptions/
│   │   │   │   └── 📁 users/
│   │   │   │       ├── 📁 dto/
│   │   │   │       ├── 📁 schemas/
│   │   │   │       ├── 📄 users.controller.ts
│   │   │   │       ├── 📄 users.module.ts
│   │   │   │       └── 📄 users.service.ts
│   │   │   ├── 📁 utils/
│   │   │   │   ├── 📄 hashing.ts
│   │   │   │   ├── 📄 pagination.ts
│   │   │   │   └── 📄 validation.ts
│   │   │   ├── 📄 app.controller.spec.ts
│   │   │   ├── 📄 app.controller.ts
│   │   │   ├── 📄 app.module.ts
│   │   │   ├── 📄 app.service.ts
│   │   │   └── 📄 main.ts
│   │   ├── 📁 test/
│   │   │   ├── 📄 app.e2e-spec.ts
│   │   │   └── ⚙️ jest-e2e.json
│   │   ├── ⚙️ .gitignore
│   │   ├── ⚙️ .prettierrc
│   │   ├── 📝 README.md
│   │   ├── 📄 eslint.config.mjs
│   │   ├── ⚙️ nest-cli.json
│   │   ├── ⚙️ package-lock.json
│   │   ├── ⚙️ package.json
│   │   └── ⚙️ tsconfig.json
│   ├── 📁 mobile/
│   │   ├── 📁 app/
│   │   │   ├── 📁 (auth)/
│   │   │   │   ├── 📄 forgot-password.tsx
│   │   │   │   ├── 📄 login.tsx
│   │   │   │   └── 📄 register.tsx
│   │   │   ├── 📁 (tabs)/
│   │   │   │   ├── 📁 applications/
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 missions/
│   │   │   │   │   ├── 📄 [id].tsx
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 profile/
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   └── 📁 settings/
│   │   │   │       └── 📄 index.tsx
│   │   │   └── 📄 _layout.tsx
│   │   ├── 📁 assets/
│   │   │   └── 📁 images/
│   │   │       ├── 🖼️ android-icon-background.png
│   │   │       ├── 🖼️ android-icon-foreground.png
│   │   │       ├── 🖼️ android-icon-monochrome.png
│   │   │       ├── 🖼️ favicon.png
│   │   │       ├── 🖼️ icon.png
│   │   │       ├── 🖼️ partial-react-logo.png
│   │   │       ├── 🖼️ react-logo.png
│   │   │       ├── 🖼️ react-logo@2x.png
│   │   │       ├── 🖼️ react-logo@3x.png
│   │   │       └── 🖼️ splash-icon.png
│   │   ├── 📁 components/
│   │   │   ├── 📁 forms/
│   │   │   ├── 📁 mission/
│   │   │   ├── 📁 ui/
│   │   │   │   ├── 📄 collapsible.tsx
│   │   │   │   ├── 📄 icon-symbol.ios.tsx
│   │   │   │   └── 📄 icon-symbol.tsx
│   │   │   ├── 📄 external-link.tsx
│   │   │   ├── 📄 haptic-tab.tsx
│   │   │   ├── 📄 hello-wave.tsx
│   │   │   ├── 📄 parallax-scroll-view.tsx
│   │   │   ├── 📄 themed-text.tsx
│   │   │   └── 📄 themed-view.tsx
│   │   ├── 📁 constants/
│   │   │   ├── 📄 colors.ts
│   │   │   ├── 📄 config.ts
│   │   │   └── 📄 theme.ts
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 use-color-scheme.ts
│   │   │   ├── 📄 use-color-scheme.web.ts
│   │   │   ├── 📄 use-theme-color.ts
│   │   │   ├── 📄 useAuth.ts
│   │   │   └── 📄 useLocation.ts
│   │   ├── 📁 scripts/
│   │   │   └── 📄 reset-project.js
│   │   ├── 📁 services/
│   │   │   ├── 📄 api.ts
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📄 driver.service.ts
│   │   │   └── 📄 misiion.service.ts
│   │   ├── 📁 store/
│   │   │   ├── 📄 authStore.ts
│   │   │   └── 📄 missionStore.ts
│   │   ├── 📁 utils/
│   │   │   ├── 📄 formatDate.ts
│   │   │   └── 📄 validation.ts
│   │   ├── ⚙️ .gitignore
│   │   ├── 📝 README.md
│   │   ├── ⚙️ app.json
│   │   ├── 📄 eslint.config.js
│   │   ├── ⚙️ package-lock.json
│   │   ├── ⚙️ package.json
│   │   └── ⚙️ tsconfig.json
│   └── 📁 web/
│       ├── 📁 app/
│       │   ├── 📁 (auth)/
│       │   │   ├── 📁 login/
│       │   │   └── 📁 register/
│       │   ├── 📁 companies/
│       │   ├── 📁 dashboard/
│       │   │   ├── 📁 admin/
│       │   │   ├── 📁 company/
│       │   │   └── 📁 driver/
│       │   ├── 📁 drivers/
│       │   ├── 📁 missions/
│       │   ├── 📄 favicon.ico
│       │   ├── 🎨 globals.css
│       │   ├── 📄 layout.tsx
│       │   └── 📄 page.tsx
│       ├── 📁 components/
│       │   ├── 📁 dashboard/
│       │   ├── 📁 forms/
│       │   ├── 📁 layout/
│       │   └── 📁 ui/
│       ├── 📁 hooks/
│       │   ├── 📄 useAuth.ts
│       │   └── 📄 useFetch.ts
│       ├── 📁 lib/
│       │   ├── 📄 auth.ts
│       │   └── 📄 axios.ts
│       ├── 📁 public/
│       │   ├── 🖼️ file.svg
│       │   ├── 🖼️ globe.svg
│       │   ├── 🖼️ next.svg
│       │   ├── 🖼️ vercel.svg
│       │   └── 🖼️ window.svg
│       ├── 📁 services/
│       │   ├── 📄 api.ts
│       │   ├── 📄 auth.service.ts
│       │   ├── 📄 mission.service.ts
│       │   └── 📄 user.service.ts
│       ├── 📁 store/
│       │   ├── 📁 slices/
│       │   └── 📄 index.ts
│       ├── 📁 styles/
│       ├── 📁 types/
│       ├── ⚙️ .gitignore
│       ├── 📝 README.md
│       ├── 📄 eslint.config.mjs
│       ├── 📄 middleware.ts
│       ├── 📄 next-env.d.ts
│       ├── 📄 next.config.ts
│       ├── ⚙️ package-lock.json
│       ├── ⚙️ package.json
│       ├── 📄 postcss.config.mjs
│       └── ⚙️ tsconfig.json
├── 📁 docs/
│   ├── 📁 api/
│   ├── 📁 architecture/
│   └── 📁 uml/
│       └── 🖼️ CargoConnect.png
├── 📁 infrastructure/
│   ├── 📁 docker/
│   │   ├── 📄 api.Dockerfile
│   │   ├── 📄 mobile.Dockerfile
│   │   └── 📄 web.Dockerfile
│   ├── 📁 nginx/
│   │   └── ⚙️ nginx.conf
│   └── 📁 scripts/
├── 📁 packages/
│   └── 📁 types/
│       ├── 📄 application.ts
│       ├── 📄 company.ts
│       ├── 📄 mission.ts
│       └── 📄 user.ts
├── 📝 README.md
├── ⚙️ docker-compose.yml
└── ⚙️ package.json
