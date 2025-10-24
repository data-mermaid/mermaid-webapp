# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **MERMAID Webapp** - a React-based offline-first web application for coral reef survey data collection and management. It syncs with the MERMAID API backend and uses IndexedDB for offline storage.

**Key Features:**
- Offline-first data collection with sync capabilities
- Multiple survey protocols (Belt Fish, Benthic LIT/PIT/PQT, Bleaching, Habitat Complexity)
- Auth0 authentication
- Service worker for offline functionality

## Prerequisites

- **Node:** 20.10.0 (use `nvm use` if you have NVM installed)
- **Yarn:** 4.1.1 (Note: some versions autogenerate `packageManager` in package.json which can cause issues. Set `COREPACK_ENABLE_AUTO_PIN=0` in shell environment if you encounter test failures)
- **Docker:** Required for running the backend API
- **Make:** For backend API commands

## Setup

1. **Set up MERMAID API backend first:**
   ```bash
   cd ../mermaid-api
   make freshinstall && make runserver
   # API runs on http://localhost:8080
   ```

2. **Set up frontend:**
   ```bash
   nvm use  # optional, sets correct Node version
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.sample` to `.env` and `.env.test.sample` to `.env.test`
   - Contact repo admins for Auth0 credentials and other secrets
   - Key variables: `VITE_MERMAID_API`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`

4. **Start development server:**
   ```bash
   yarn start  # Runs on http://localhost:3000
   ```

## Common Commands

### Development
```bash
yarn start              # Start dev server with hot reload (port 3000)
yarn build              # TypeScript check + production build
yarn serve              # Preview production build
yarn preview            # Preview production build (alias)
```

### Code Quality
```bash
yarn lint               # Run TypeScript + ESLint
yarn prettier           # Format all files in src/
yarn test               # Run all tests with Jest
yarn test <filename>    # Run specific test file
```

### Scaffolding
```bash
plop <filename>         # Scaffold new component in src/components/
```

### Git Hooks
- **pre-commit:** Runs Prettier automatically
- **pre-push:** Runs lint + tests (must pass before push)

## Architecture

### Offline-First Data Flow

The app uses a three-layer data architecture:

1. **API (Django REST)** - Source of truth on server
2. **IndexedDB (Dexie.js)** - Local offline storage per user
3. **React State** - UI state management

**Data flow:** API ↔ Sync Layer ↔ IndexedDB ↔ DatabaseSwitchboard ↔ React Components

### Core Systems

#### DatabaseSwitchboard (`src/App/mermaidData/databaseSwitchboard/`)

The **DatabaseSwitchboard** is the primary interface for data operations. It abstracts whether data comes from IndexedDB or the API.

**Key principles:**
- **Always use DatabaseSwitchboard** for data access - never call API or IndexedDB directly from components
- Generally uses IndexedDB as source of truth (since sync keeps it updated)
- Composed via mixins for different data types (Projects, Sites, CollectRecords, etc.)

**Main instance:** `src/App/mermaidData/databaseSwitchboard/index.js` exports `databaseSwitchboardInstance`

**Mixins:**
- `ProjectsMixin` - Project CRUD operations
- `SitesMixin` - Site management
- `CollectRecordsMixin` - Survey record CRUD
- `ChoicesMixin` - Choice data (protocols, fish families, etc.)
- `BenthicAttributesMixin` - Benthic attributes
- `FishNamesMixin` - Fish species data
- `ManagementRegimesMixin` - Management regime data
- `SubmittedRecordsMixin` - Submitted records
- `ProjectHealthMixin` - Project health/validation
- `GfcrMixin` - GFCR-specific operations
- `ImageClassificationMixin` - Image annotation operations

#### Syncing System (`src/App/mermaidData/syncApiDataIntoOfflineStorage/`)

**Sync triggers:**
1. Automatic: Navigating to projects list or any project page
2. Manual: After create/edit/delete operations via DatabaseSwitchboard

**Key class:** `SyncApiDataIntoOfflineStorage`

**Important sync methods:**
- `pushChanges()` - Push local changes to API
- `pullAllProjects()` - Pull all projects
- `pushThenPullEverything()` - Full bidirectional sync
- `pushThenPullAllProjectDataExceptChoices(projectId)` - Project-specific sync (common)

**Sync hooks:**
- `useInitializeSyncApiDataIntoOfflineStorage` - Auto-sync on navigation
- `useSyncStatus()` - Get current sync status
- Must call `setIsSyncInProgress` when manually syncing

**Important:** Syncs return 200 even with errors. Check `status_code` property in response for per-item sync errors (handled in `DatabaseSwitchboardState.js`).

#### State Management

**React Context providers** (in `src/App/`):
- `CurrentUserContext` - Current user profile
- `CurrentProjectContext` - Active project
- `BellNotificationContext` - Notifications
- `HttpResponseErrorHandlerContext` - Global error handling
- `dexiePerUserDataInstanceContext` - Dexie database instance per user

**UI state stored on data:**
- Properties prefixed with `uiState_` are stored on MERMAID data objects
- Removed before pushing to API
- Example: `uiState_pushToApi` - marks entity for inclusion in next API push

**API state properties:**
- `last_revision_num` - Revision tracking for sync
- `_deleted` - Marks item as deleted for API

### Form Management

**Two approaches coexist** (known tech debt):

1. **Formik** - Used for most forms (Project Info, Sites, Management Regimes)
2. **useReducer** - Used for observation tables in Collect Records

When handling dirty form state, check both systems.

**Navigation prompts:**
- `useBeforeUnloadPrompt` - Browser navigation (refresh/back/forward)
- `useBlocker` (react-router-dom) - In-app navigation
- Combined in `<EnhancedPrompt>` component

### Component Organization

```
src/components/
├── generic/          # Reusable, context-unaware components (can be used in other projects)
├── pages/            # Page or page-like components
│   ├── collectRecordFormPages/  # Survey data collection forms
│   ├── ProjectInfo/  # Project management
│   ├── Sites/        # Site management
│   ├── ManagementRegimes/  # Management regime pages
│   └── ...
└── [other components]  # MERMAID-specific reusable components
```

### Layouts

Two main layout components:
1. **General layout** - Header and footer (most pages)
2. **Project layout** - Special layout with side nav slots for project pages

### Styling

- **Styled Components** for scoped CSS
- Material-UI (MUI) components
- Guidelines in `docs/StylingGuidelines.md`

## Testing

### Philosophy

- Focus on **critical paths** and **complex code**
- Prioritize **offline functionality** testing
- 100% coverage is **not** a goal

### Running Tests

```bash
yarn test                           # Run all tests
yarn test <filename>                # Run specific test
TZ=UTC jest --setupFilesAfterEnv=./src/setupTests.js  # Full test command
```

### Test Utilities (`src/testUtilities/`)

**Key helpers:**
- `testingLibraryWithHelpers.jsx` - Exports render helpers
- `initiallyHydrateOfflineStorageWithMockData.js` - Populate IndexedDB with test data
- `i18nTestHelpers.tsx` - i18n testing utilities
- Mock data files: `mockCollectRecords/`, `mockBenthicPitValidationsObject.js`, etc.

**Environment variable:**
- Set `VITE_IGNORE_TESTING_ACT_WARNINGS=true` in `.env` to suppress act warnings

### Testing with Offline/Online States

Use render helpers to test different states:
- Tests should mock both offline and online scenarios
- Use Dexie mocks: `fake-indexeddb` package
- API mocking: `msw` (Mock Service Worker)

## Internationalization (i18n)

- **Library:** i18next + react-i18next
- **Translation files:** `src/locales/`
- **Guidelines:** `docs/TranslationBestPractices.md`

## Development Notes

### Hot Reloading

Hot reloading can be inconsistent. **DatabaseSwitchboard code changes require manual browser refresh.**

### Build Tool

- Migrated from Create React App to **Vite**
- Tests still use **Jest** (not Vitest) to avoid refactoring
- If a package causes test issues, configure `transformIgnorePatterns` in `jest.config.js`

### Reset API

To reset the API database:
```bash
cd ../mermaid-api
make freshinstall
```

## Deployment

### Pull Request Previews

- **URL:** `preview.app2.datamermaid.org/<PR-NUMBER>/index.html`
- Created automatically on PR open/sync/reopen
- Bot adds comment with preview link
- Deleted when PR is merged/closed

### Dev Environment

- **URL:** https://dev-app.datamermaid.org
- Deploys on push to `develop` branch
- Use **merge** commits when merging to develop (not rebase or squash)

### Production

- **URL:** https://app.datamermaid.org
- Deploys on semantic version tag creation (e.g., `v2.0`, `v2.0.0`)

### Infrastructure as Code

- **Location:** `iac/` directory
- **Tool:** AWS CDK (TypeScript)
- **CI/CD:** GitHub Actions
- See `iac/README.md` for details
- **Do not deploy manually** - use GitHub Actions

## Important Patterns

### Data Operations Pattern

```javascript
// 1. Update IndexedDB via DatabaseSwitchboard
await databaseSwitchboard.saveSite(siteData)

// 2. Mark sync in progress
setIsSyncInProgress(true)

// 3. Push to API and pull updates
await apiSyncInstance.pushThenPullAllProjectDataExceptChoices(projectId)

// 4. Mark sync complete
setIsSyncInProgress(false)
```

### Sync Error Handling

- HTTP errors: Standard axios error handling
- **Nested sync errors:** Check `status_code` in response data
- See `_getMermaidDataPushSyncStatusCodeError` in `DatabaseSwitchboardState.js` for details

### Working with Dexie/IndexedDB

- User-specific database instance: `dexiePerUserDataInstance` from context
- Current user database: `dexieCurrentUserInstance` for profile data
- Tables: `projects`, `project_sites`, `collect_records`, `choices`, `benthic_attributes`, `fish_species`, etc.

## File Paths for Common Tasks

### Adding new survey protocol
- Models: Check API `new_protocol_readme.md`
- Frontend constants: `src/constants/constants.js`
- Form pages: `src/components/pages/collectRecordFormPages/`
- DatabaseSwitchboard mixin: Create new mixin in `src/App/mermaidData/databaseSwitchboard/`

### Modifying sync behavior
- Sync class: `src/App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage.js`
- Sync hooks: `src/App/mermaidData/syncApiDataIntoOfflineStorage/useInitializeSyncApiDataIntoOfflineStorage.js`
- Pull API data: `src/App/mermaidData/pullApiData.js`

### Working with forms
- Form components: `src/components/pages/`
- Form validation: `src/library/validations/` and Yup schemas inline
- Formik helpers: `src/library/formik/`

### Authentication
- Auth hook: `src/App/useAuthentication.js`
- Auth context: Provided by `@auth0/auth0-react`
- Auth headers: `src/library/getAuthorizationHeaders.js`

## Known Issues & Tech Debt

- Dual form state management (Formik + useReducer) adds complexity
- Hot reloading inconsistent for DatabaseSwitchboard changes
- Some packages require special babel configuration for tests
- Tech debt tracked in Trello with "Tech debt:" prefix

## Related Repositories

This webapp works with:
- **mermaid-api** (../mermaid-api): Django REST API backend
- **mermaid-dash-v2** (../mermaid-dash-v2): React dashboard for data visualization

See parent `CLAUDE.md` for cross-repository architecture.
