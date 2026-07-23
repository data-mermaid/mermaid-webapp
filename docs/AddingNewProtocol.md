### Add a Feature Gate for New Protocol Development

Use a feature gate so in-progress work for a new protocol can merge safely without exposing unfinished UI in production.

- Requirements:
  Reuse existing feature-flag infrastructure that reads a backend-provided optional feature (for example, `<new_protocol>_enabled`) and gates rendering through a reusable wrapper. Also ensure the API/database feature-flag row exists (for example, a `MERMAIDFeature` row named `<new_protocol>_enabled`), otherwise frontend gating will never activate.
- Acceptance criteria:
  1.  A backend-driven boolean feature flag is available to the frontend.
  2.  Frontend logic can read the flag from current user optional features.
  3.  New protocol surfaces can be hidden when the flag is off.
  4.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/generic/GatedFeature/GatedFeature.tsx
  2.  src/components/generic/GatedFeature/index.ts
  3.  src/library/getCurrentUserOptionalFeature.ts

### Cross-Repo Prerequisite Before Frontend Step 2

Before starting frontend core data-layer registration, deploy API changes for the new protocol through API URL/endpoint registration steps.

- Requirements:
  API-side protocol constant(s), `data_policy_<new_protocol>` model field(s), and sample-unit-method endpoint slug should exist in dev before frontend core data-layer wiring begins.
- Acceptance criteria:
  1.  API readme protocol registration steps (including URL registration) are complete and deployed to dev.
  2.  Frontend step 2 uses confirmed API slugs/field names, not placeholders.

### Register New Protocol in Core Data Layer

Register protocol identifiers, transect/observation mappings, and project-level policy fields before building protocol UI.

- Requirements:
  Add support for the new protocol in shared data types and helper maps, with no UI dependency required for this step.
- Acceptance criteria:
  1.  Add protocol-specific interfaces/types in shared data models.
  2.  Add project policy field (for example, `data_policy_<new_protocol>`) to typed and runtime shapes.
  3.  Add protocol entries in record protocol helpers for transect key, observation key(s), and methods endpoint.
  4.  Add new protocol to submitted-record protocol query logic.
  5.  Lint/tests/type checks pass.
- Possible files that may be affected or need to be added:
  1.  src/App/mermaidData/mermaidDataTypes.ts
  2.  src/App/mermaidData/mermaidDataProptypes.js
  3.  src/App/mermaidData/recordProtocolHelpers.ts
  4.  src/App/mermaidData/databaseSwitchboard/SubmittedRecordsMixin.js

### Add Translation Keys for New Protocol

New protocol labels and toasts should be tokenized in i18n files before UI surfaces are released.

- Requirements:
  Add locale keys for protocol title and user-facing messages (for example, data-sharing success toasts).
- Acceptance criteria:
  1.  Add protocol title key under `protocol_titles.<new_protocol>`.
  2.  Add protocol-specific success/error keys used by UI flows.
  3.  Ensure key naming follows existing i18n conventions.
  4.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/locales/en/translation.json
  2.  src/locales/\*/translation.json (if localization rollout includes non-English locales)

### Add New Protocol to Data Sharing Surfaces

Project-level data-sharing controls should include the new protocol in admin/edit, read-only, and info-modal views.

- Requirements:
  Add a standalone data-sharing policy row for the new protocol and wire toast messaging, initial form values, and info modal rows.
- Acceptance criteria:
  1.  Admin data-sharing table includes new protocol row bound to `data_policy_<new_protocol>`.
  2.  Read-only data-sharing content shows new protocol label and policy value.
  3.  Toast-message logic maps new protocol policy changes to protocol-specific translation keys.
  4.  Project initial form values include `data_policy_<new_protocol>`.
  5.  Data-sharing info modal includes new protocol-specific content rows.
  6.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/pages/DataSharing/DataSharing.jsx
  2.  src/components/pages/ProjectInfo/projectRecordInitialFormValue.js
  3.  src/components/DataSharingInfoModal/DataSharingInfoModal.jsx
  4.  src/locales/en/translation.json

### Add New Protocol to Project Card Data Sharing Summary

Users should see the new protocol data-sharing status on project cards.

- Requirements:
  Add the new protocol policy label/value row in project card summary, following existing ordering/feature-gating behavior.
- Acceptance criteria:
  1.  Project card summary reads `data_policy_<new_protocol>`.
  2.  Summary renders new protocol policy label/value entry.
  3.  Shared project prop/type shapes include the new policy field.
  4.  Tests cover feature-on/feature-off and rendering behavior.
  5.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/ProjectCard/ProjectCardSummary.jsx
  2.  src/App/mermaidData/mermaidDataProptypes.js
  3.  src/App/unitTests/Projects.test.tsx
  4.  src/testUtilities/mockMermaidData.js

### Add New Protocol to Shared Method Filters

Any shared methods filter should include the new protocol option where applicable.

- Requirements:
  Add `protocol_titles.<new_protocol>` to method keys list with explicit ordering decision and feature-gate handling.
- Acceptance criteria:
  1.  New protocol appears in method dropdown list in agreed position.
  2.  Option is hidden when feature flag is off.
  3.  Unit tests validate option count/content for feature on/off.
  4.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/MethodsFilterDropDown/MethodsFilterDropDown.tsx
  2.  src/components/MethodsFilterDropDown/MethodsFilterDropDown.test.tsx

### Add New Protocol to Submitted Export Controls

If submitted exports are protocol-aware, include the new protocol in export action menus.

- Requirements:
  Add a new protocol export item wired to shared export handler and disabled-state logic.
- Acceptance criteria:
  1.  Export menu includes new protocol entry.
  2.  Disabled/enabled state is wired to protocol sample-event counts.
  3.  Export handler receives new protocol identifier.
  4.  Option follows feature-gating rules.
  5.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/pages/Submitted/SubmittedToolbarSection.tsx
  2.  src/types/protocols.ts
  3.  src/types/submitted.ts

### Scaffold Collect Form for New Protocol

Create a protocol form shell first: routes, transect inputs, data pipeline wiring, and placeholder observation area.

- Requirements:
  Add new protocol collect route(s), add-sample-unit entry, base form component, and save/reformat pipeline wiring.
- Acceptance criteria:
  1.  New protocol form folder and scaffold files exist.
  2.  New/edit collect routes are registered.
  3.  Add Sample Unit menu links to new protocol form.
  4.  Reformat/save pipeline maps form values to protocol transect/observation payload keys.
  5.  Placeholder observations area is present until full observation table lands.
  6.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/App/routes.jsx
  2.  src/components/pages/Collect/AddSampleUnitButton.jsx
  3.  src/components/pages/collectRecordFormPages/<NewProtocolForm>/
  4.  src/components/pages/collectRecordFormPages/reformatFormValuesIntoRecord.js
  5.  src/App/mermaidData/mermaidDataTypes.ts

### Implement Observation Table and Propose-New-Attribute Flow

Replace placeholder observations with full row editing and optional propose-new-attribute/species workflow.

- Requirements:
  Implement row CRUD, per-row validations, size/count/notes handling, and taxonomy proposal flow. Ensure behavior rules are explicit (gating, optional fields, alignment, keyboard interactions, decimal formatting, modal confirmations).
  If the new protocol introduces its own taxonomy, include two-source taxonomy sync design in this step:
  1. read-only hierarchy source and 2) writable leaf/species source, with frontend reconciliation between API type names and local table names.
- Acceptance criteria:
  1.  Full observation table supports add/edit/delete/duplicate row behavior.
  2.  Observation reducer/actions cover required row state updates.
  3.  Propose-new-attribute/species modal flow is wired end-to-end.
  4.  Validation paths are wired for protocol observation data.
  5.  Notes edit flow includes correct keyboard/focus behavior.
  6.  Transect setting changes that invalidate observation fields are guarded by confirmation modal when needed.
  7.  Field optionality and conditional column rendering behave as specified.
  8.  Text columns are left-aligned; numeric columns are right-aligned.
  9.  Numeric formatting rules (for dropdown labels, summary values, conditional inputs) are enforced.
  10. Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/pages/collectRecordFormPages/<NewProtocolForm>/<ObservationTable>.tsx
  2.  src/components/pages/collectRecordFormPages/<NewProtocolForm>/<TransectInputs>.tsx
  3.  src/components/pages/collectRecordFormPages/<NewProtocolForm>/<ObservationReducer>.js
  4.  src/components/pages/collectRecordFormPages/ObservationSizeSelect.jsx
  5.  src/components/pages/collectRecordFormPages/<NewProtocolForm>/<NotesModal>.tsx
  6.  src/components/NewAttributeModal.tsx
  7.  src/locales/en/translation.json
  8.  src/App/mermaidData/pullApiData.js
  9.  src/App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage.js
  10. src/App/mermaidData/databaseSwitchboard/\*Mixin.js
  11. src/App/mermaidData/databaseSwitchboard/DatabaseSwitchboard.ts
  12. src/App/mermaidData/getAttributesInUse.ts
  13. src/App/mermaidData/getSelectableAttributes.ts

### Implement Submitted Record View and Calculated Metrics

Add a read-only submitted view for the new protocol with info table, observation table, validation display, and client-side summary metrics.

- Requirements:
  Build submitted page components, route wiring, and metric helpers (pure functions/hooks). Keep display formatting and empty-state behavior explicit.
- Acceptance criteria:
  1.  Submitted page wrapper, info table, observation table, and index export are added.
  2.  Submitted route is registered.
  3.  Metric helper(s) compute protocol summary values from observation rows and transect inputs.
  4.  Summary values use required decimal formatting.
  5.  Table alignment rules are enforced.
  6.  Empty-state logic (for example, group summary headers with no rows) is correct.
  7.  Validation messages render in submitted view as available.
  8.  Lint/tests pass.
- Possible files that may be affected or need to be added:
  1.  src/components/pages/submittedRecordPages/Submitted<NewProtocol>/
  2.  src/library/<protocol>/calculate<Protocol>Metrics.ts
  3.  src/library/<protocol>/use<Protocol>Metrics.ts
  4.  src/components/pages/<Protocol>/SummaryStats.tsx
  5.  src/components/generic/Table/table.js
  6.  src/components/generic/Table/table.d.ts
  7.  src/App/routes.jsx
  8.  src/App/mermaidData/mermaidDataTypes.ts
  9.  src/App/mermaidData/mermaidDataProptypes.js
  10. src/locales/en/translation.json

### Add Integration Tests for New Protocol

Mirror existing protocol test coverage to prevent regressions as feature work expands.

- Requirements:
  Add end-to-end integration tests for create/update/delete/submit/validations/proposal flows and update shared fixtures and counts.
- Acceptance criteria:
  1.  New protocol integration test folder exists with scenario-parity test files.
  2.  Fixtures for collect records and validations are added/updated.
  3.  Shared mock data hydration includes new protocol data.
  4.  Shared tests with global counts/sorting are updated as needed.
  5.  Full test suite remains green.
- Possible files that may be affected or need to be added:
  1.  src/App/integrationTests/collectRecords/<newProtocol>/
  2.  src/testUtilities/mockCollectRecords/mock<NewProtocol>CollectRecords.js
  3.  src/testUtilities/mock<NewProtocol>ValidationsObject.js
  4.  src/testUtilities/mockMermaidData.js
  5.  src/testUtilities/initiallyHydrateOfflineStorageWithMockData.js
  6.  Shared integration tests that assert global counts/page sizes/sort order
