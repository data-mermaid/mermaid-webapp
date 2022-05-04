# Mermaid Webapp

## Steps to Set Up Development Environment

1. Set up a local Mermaid back end
   1. Clone https://github.com/data-mermaid/mermaid-api
   1. To get the server up and running, run `make freshinstall && make runserver` the first time or `make up && make runserver`
1. Set up local front end
   1. clone this repo
   1. obtain values for `.env` file (see `.env.sample`, bug Dustin for the DAshlane file with all the secrets.)
   1. yarn install
   1. yarn start

## Dev Notes

- `plop <filename>` scaffolds component files inside the `src/components` directory
- `src/components/generic` are be for reusable components that may be useful for other projects. They should be developed to be completely unaware of their context. Make them 'dumb' (employ inversion of control). If a reusable component is Mermaid-specific, it can go elsewhere.
- `src/components/pages` are for pages or page-like components
- Styles will be done with Styled Components for easy scoping, speed, and maintainability. Make sure to import using the macro for easier debugging (it results in more human-friendly classnames) `import styled from 'styled-components/macro'`
- Focus on integration tests, and testing complex pieces of code.
- Although there is no comprehensive list, tech debt tickets are tracked in Trello with a label, or the title prefix 'Tech debt:'. Most are in the 'Someday' column. Its worth browsing them for context.
- The fishbelt form page is a gong show. We havent had a refactor cycle to make it more maintaible in between the many various features and bandaids being added to it. Dont copy its approach. The main issue with it is that Formik didnt age will with the requirements as they revealed themselves. The observations table part of the form, thankfully, doesnt use Formik, however using two different approaches for form state cascaded into much more duplication and complication in the code for that page. For some reason the form also loses its dirty/unsaved values when the network status changes, which resulted in a hack that involves saving unsaved values in local storage, which in hindsight was a bad choice (I probably thought it was unavoidable due to props changing, but there are indications that it may be caused by internal state changing). Yuck. Here be dragons.

### General Architecture (Incomplete WIP)

The general approach to this code has been to avoid premature performance optimization in favour of more maintainable code. When possible, it is also attempted to keep as much code outside of React and in regular JavaScript as possible. The idea is to make the code more approachable for non-React devs (Dustin, Kim), and to make more of the code reusable in future cases of framework swapouts.

#### Syncing data with the server

Initialize navigation and app-load-based auto sync with the `useInitializeSyncApiDataIntoOfflineStorage` hook, get sync status state from the `useSyncStatus()` hook. Both hooks depend on `SyncStatusProvider`
These auto syncs are triggered when navigating to the projects list page, and any time a user navigates to a project-related page. Note that not all syncs pull the same things. - the hooks take care of nagivation and reload based syncs.

There is also an `apiSyncInstance` available in the app for manualy controled syncs. Typically, in the databaseSwitchboard, creating, editing, or deleting Mermaid data will involve pushing the changes to IDB first, then pushing to the API, and then using the `pushThenPullEverythingForAProjectButChoices` to make sure a sync happens with all the data (beyond what was just pushed). The Project card component is an exception. There, the component code triggers a sync when the offline-ready checkbox is toggled. The component code handling sync, IDB, or API operations should generally be avoided. Whenever triggering a manual sync, make sure to set the sync status appropriately via `setIsSyncInProgress`

Syncs also _should_ be triggered on many create/update/delete operations within the databaseSwitchboard (its enforced through code review, so its always good to check that a sync is happening before relying on it. Look for various functions being used from syncApiDataIntoOfflineStorage names starting with 'pushThenPullEverything')

#### Database Switchboard

The `DatabaseSwitchBoardInstance` is responsible for getting data to the app. It takes care of if the data should come from IndexedDB (IDB) or the API so the app does not have to think as much about it. The idea is not to call the API or interact with IDB other than though the DatabaseSwitchboard for maintainability. In general, because of the app syncing the databaseSwitchboard usually uses IDB as a source of truth on Mermaid Data for foundational app logic, or for offline-able pages because the sync code pulls from the API and puts it in IDB quite frequently.

Class mixins were used unfortunately, but other than having unclear inheritance and a weird implementation syntax, seem to be working just fine so far.

#### Layout

There are two main layout compoenets. One for general page layout (header and footer) and a special one for project pages (It has slots for side nav, and two other sections)

#### State management

As a tradeoff between mixing concerns and having an overlycomplex, it was decided to track some ui state on the Mermaid data itself. These properties are prefized with `uiState_`, and are removed before pushing the data to the API. It is questionable in hindsight if this was the best approach. Noteworthy ui state:

- ` uiState_pushToApi` set to true if you want an entity to be included in the next push to the API
- API stuff:
  - `last_revision_num` is tricky and there are no API docs for it. Definitely Dustin for an overview if you need to touch it (I cant remember the details).
  - a `_deleted` property is stored and sent to the api to let it know to delete an item.

#### Navigation prompts

There are currently two ways the application warns the user about navigating away from an unsaved (dirty) form:

1. `useBeforeUnloadPrompt` to add an event listener to detect browser navigation (refresh, back, forward etc)
2. `<Prompt>` from `react-router-dom` to handle navigation occurring within the application through react router.
   These have been combined into a single high order component named `<EnhancedPrompt>` which has been added to all forms in the application.

React router v6 will eventually provide a hook called `usePrompt` which will cover both of the above and will display the same default modal/popup for both. Another similar hook named `useBlocker` will be provided too. [Good reference](https://stackoverflow.com/questions/62792342/in-react-router-v6-how-to-check-form-is-dirty-before-leaving-page-route) with link to a demo. These hooks were available in the v6 alpha, but have been removed until later in the stable v6 ([upgrade guide](https://reactrouter.com/docs/en/v6/upgrading/v5#prompt-is-not-currently-supported))

#### Testing

The goal of testing is not 100% test coverage. Its to test critical path features or any complex code. Currently we are focusing test effort on offline functionality, and ignoring online-only functionality.

Since this app can exist in multiple states (online, offline, various states of data), test helpers were created to abstract much of this set up. The main ones are:

- renderAuthenticatedOffline, renderAuthenticatedOnline, getMockDexieInstancesAllSuccess, initiallyHydrateOfflineStorageWithMockData (use for offline tests)

## Deploying

### Pull Request Previews

- Available at `preview.datamermaid.org/<pull-request-number-here>/`
- A preview of the application is created when a pull request is opened, sychronized (commit is made), or re-opened.
- A bot will add a PR comment with the link to the preview, once it is ready.
- Once a pull request is merged or closed, the respective preview will be deleted.

### Develop (non-prod)

- Available at [dev-app.datamermaid.org](https://dev-app.datamermaid.org)
- Is updated any time someone pushes to the `develop` branch

### Production

- Available at [app.datamermaid.org](https://app.datamermaid.org)
- Is updated on tag creation
