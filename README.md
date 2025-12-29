# MERMAID Webapp

## Requirements

- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

  - As of last readme update 4.1.1 has been tested and works
  - Some developers have had issues when versions of Yarn autogenerate a `packageManager` setting in `package.json`. This has caused tests to fail or other things to have errors. The solution in one case was to add COREPACK_ENABLE_AUTO_PIN=0 to the shell environment before running any yarn commands.

- Node 20.10.0
  - Optionally but recommended, use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) to set the node version: run `nvm use`
- [Docker](https://docs.docker.com/get-docker/)
- [Make](https://www.gnu.org/software/make/)

## Steps to Set Up Development Environment

1. Set up a local MERMAID back end
   1. Clone https://github.com/data-mermaid/mermaid-api
   1. To get the server up and running, run `make freshinstall && make runserver` the first time or `make up && make runserver`
1. Set up local front end
   1. clone this repo
   1. obtain values for `.env` and `.env.test` files. (see `.env.sample` and `env.test.sample`. (Contact repo admins for access to environment variables)
   1. optional: `nvm use` (this will make sure you are using the right node version if you have NVM installed)
   1. `yarn install`
   1. `yarn start` -- builds to http://localhost:3000

## Dev Notes

- `plop <filename>` scaffolds component files inside the `src/components` directory
- `src/components/generic` are for reusable components that may be useful for other projects. They should be developed to be completely unaware of their context. If a reusable component is MERMAID-specific, it can go elsewhere.
- `src/components/pages` are for pages or page-like components
- Styles use Styled Components for easy scoping, speed, and maintainability.
- Focus on user-focused integration tests, and testing complex pieces of code. 100% test coverage is not a goal for this project.
- Although there is no comprehensive list, tech debt tickets are tracked in Trello with a label, or the title prefix 'Tech debt:'. Most are in the 'Someday' column.
- Collect Record form pages use two different approaches to managing form state. Formik had its limitations, so for the observations tables we opted to store form state with a reducer. This inconsistency has led to some tech debt and complexity that was determined to be acceptable, but its worth knowing when handling things like dirty form state, that there are two states to consider.
- Hot reloading happens inconsistently, notably, changes to DatabaseSwitchboard code seem to require a manual browser refresh.
- To reset the API and its database, run `make freshinstall`
- This app was initialized with Create React App, and then migrated to vite. To avoid refactoring tests, we opted to use Jest to run tests instead of Vitest. If a package is installed that creates issues in tests, a possible solution might be to ensure it gets processed with babel in `jest.config.ts`'s `transformIgnorePatterns` configuration.

### General Architecture

The general approach to this code has been to avoid premature performance optimization in favour of more maintainable code. When possible, attempts are made to keep as much code outside of React and in regular JavaScript as possible. The idea is to make the code more approachable for non-React devs, and to make more of the code reusable in future cases of framework swapouts or upgrades.

#### Syncing data with the server

Initialize navigation and auto sync with the `useInitializeSyncApiDataIntoOfflineStorage` hook, get sync status state from the `useSyncStatus()` hook. Both hooks depend on `SyncStatusProvider`
These auto syncs are triggered when navigating to the projects list page, and any time a user navigates to a project-related page. Note that not all syncs pull the same things. These hooks take care of nagivation and reload based syncs.

There is also an `apiSyncInstance` available in the app for manualy controled syncs. Typically, in the databaseSwitchboard, creating, editing, or deleting MERMAID data will involve pushing the changes to IDB first, then pushing to the API, and then using the `pushThenPullAllProjectDataExceptChoices` to make sure a sync happens with all the data (beyond what was just pushed). Component code handling sync, IDB, or API operations should generally be avoided. Whenever triggering a manual sync, make sure to set the sync status appropriately via `setIsSyncInProgress`

Syncs also _should_ be triggered on many create/update/delete operations within the databaseSwitchboard (its enforced through code review, so its always good to check that a sync is happening before relying on it. Look for various functions being used from syncApiDataIntoOfflineStorage names starting with 'pushThenPullEverything')

##### Sync errors

When data is pushed to the API, if there are no http-related errors, a 200 success response is returned even when there are sync errors. Sync errors are parsed from a response's `status_code` property in the `_getMermaidDataPushSyncStatusCodeError` function of the DatabaseSwitchboard Class (`src/App/mermaidData/databaseSwitchboard/DatabaseSwitchboardState.js`). See this function for more detailed comments.

#### Database Switchboard

The `DatabaseSwitchBoardInstance` is responsible for getting data to the app. It takes care of if the data should come from IndexedDB (IDB) or the API so the app does not have to think as much about it. The idea is not to call the API or interact with IDB other than though the DatabaseSwitchboard. In general, because of the app syncing, the databaseSwitchboard usually uses indexedDB over the DB on the server as a source of truth on MERMAID Data for foundational app logic, or for offline-able pages because the sync code pulls from the API and puts it in IDB quite frequently.

#### Layout

There are two main layout components. One for general page layout (header and footer) and a special one for project pages (It has slots for side nav, and two other sections).

#### State management

As a tradeoff between mixing concerns or having overly complex code, it was decided to track some ui state on the MERMAID data itself. These properties are prefixed with `uiState_`, and are removed before pushing the data to the API.

##### Noteworthy UI state:

- ` uiState_pushToApi` set to true if you want an entity to be included in the next push to the API

##### Noteworthy API state:

- `last_revision_num` Ask the API maintainers for info if you ever have to work with it.
- a `_deleted` property is stored and sent to the api to let it know to delete an item.

#### Navigation prompts

There are currently two ways the application warns the user about navigating away from an unsaved (dirty) form:

1. `useBeforeUnloadPrompt` to add an event listener to detect browser navigation (refresh, back, forward etc)
2. `useBlocker` from `react-router-dom` to handle navigation occurring within the application through react router.
   These have been combined into a single component named `<EnhancedPrompt>` which has been added to all forms in the application.

#### Testing

The goal of testing is not 100% test coverage. Its to test critical path features or any complex code. Currently we are focusing test effort on offline functionality, and ignoring online-only functionality.

Since this app can exist in multiple states (online, offline, various states of data), test helpers were created to abstract much of this set up. The main ones are:

- renderAuthenticatedOffline, renderAuthenticatedOnline, getMockDexieInstancesAllSuccess, initiallyHydrateOfflineStorageWithMockData (use for offline tests)

If you would like to suppress missing act warnings in your test console, you can add `VITE_IGNORE_TESTING_ACT_WARNINGS=true` to `.env`

## Deploying

### Pull Request Previews

- Available at `preview.app2.datamermaid.org/<pull-request-number-here>/index.html`
- A preview of the application is created when a pull request is opened, sychronized (commit is made), or re-opened.
- A bot will add a PR comment with the link to the preview, once it is ready.
- Once a pull request is merged or closed, the respective preview will be deleted.
- Please use merge to update the develop branch when merging via GitHub (not rebase and not squash + merge)

### Develop (non-prod)

- Available at [dev-app.datamermaid.org](https://dev-app.datamermaid.org)
- Is updated any time someone pushes to the `develop` branch

### Production

- Available at [app.datamermaid.org](https://app.datamermaid.org)
- Is updated using semantically versioned (eg: `v2.0` or `v2.0.0`) tag creation

### Infrastructure as Code (IaC)

- see `iac/README.md`
