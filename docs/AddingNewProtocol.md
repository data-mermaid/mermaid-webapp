# Adding a new survey protocol to Collect

This guide lists the frontend work needed to add a survey protocol to MERMAID Collect, in dependency order. It covers this repository only. The API side (models, migrations, endpoints, sync sources) is covered by [`readme/new_protocol_readme.md` in mermaid-api](https://github.com/data-mermaid/mermaid-api/blob/dev/readme/new_protocol_readme.md).

The steps come from the macroinvertebrate belt protocol, the most recent protocol added. Its protocol id is `macroinvertebrate`, its transect key is `beltinvert_transect`, and its observation key is `obs_belt_inverts`. Each step names the macroinvertebrate files so you can open a working example. If this guide misses something, search the codebase for `macroinvertebrate` and `beltinvert` to find the rest.

## Before you start

**API changes must be deployed to dev first.** Steps 2 onward read real API responses, so the following must exist on the dev API before you start them:

- The protocol constant and its entry in `PROTOCOL_MAP`.
- The `data_policy_<protocol>` field on `Project`.
- The sample unit methods endpoint slug (for example `beltinverttransectmethods`).
- If the protocol has its own taxonomy, both sync sources (see [step 7](#7-build-the-observation-table)).

**The feature flag is a database row, not code.** The API resolves `optional_features` from `MERMAIDFeature` and `UserMERMAIDFeature` rows (`mermaid-api/src/api/resources/me.py`, `get_optional_features`). Create a `MERMAIDFeature` row named `<protocol>_enabled` in the Django admin, then enable it for your own user. Without the row, nothing you gate in step 1 will ever render.

**Every step ends the same way:** `yarn lint` (runs `tsc` and ESLint) and `yarn test` pass. The "Done when" lists below do not repeat this.

## Steps

1. [Gate the work behind the feature flag](#1-gate-the-work-behind-the-feature-flag)
2. [Register the protocol in the data layer](#2-register-the-protocol-in-the-data-layer)
3. [Add translation keys](#3-add-translation-keys)
4. [Add the protocol to data-sharing surfaces](#4-add-the-protocol-to-data-sharing-surfaces)
5. [Add the protocol to the methods filter and the export menu](#5-add-the-protocol-to-the-methods-filter-and-the-export-menu)
6. [Scaffold the Collect form](#6-scaffold-the-collect-form)
7. [Build the observation table](#7-build-the-observation-table)
8. [Build the submitted record view](#8-build-the-submitted-record-view)
9. [Add integration tests](#9-add-integration-tests)

### 1. Gate the work behind the feature flag

Wrap every new UI surface in `GatedFeature` so partial work can merge to `develop` without appearing in production.

**What to do**

- Use the flag name `<protocol>_enabled` everywhere. The string is the only link between the frontend and the database row.
- Wrap each new surface in `<GatedFeature featureFlag="<protocol>_enabled">`. Where you need the boolean rather than conditional rendering (for example, to filter an options array), call `getCurrentUserOptionalFeature(currentUser, '<protocol>_enabled')` directly.
- Mark each gate with a comment such as `// Remove when <protocol> goes live`, as `MethodsFilterDropDown.tsx` does, so the gates are easy to find and remove later.

Nothing needs building. `GatedFeature` and `getCurrentUserOptionalFeature` already exist.

**Files**

- `src/components/generic/GatedFeature/GatedFeature.tsx` - the wrapper. Read it; don't change it.
- `src/library/getCurrentUserOptionalFeature.ts` - the lookup behind the wrapper.

### 2. Register the protocol in the data layer

Teach the shared helpers the protocol's keys. The Collect and Submitted list pages, record loading, and validation all derive protocol-specific behaviour from these maps, so most list-level UI works as soon as this step is done.

**What to do**

- Add the protocol id to the `Protocol` union in `src/types/protocols.ts` and to the local `Protocol` type in `recordProtocolHelpers.ts`.
- In `recordProtocolHelpers.ts`, add an entry to each map: `getProtocolTransectType` (transect key), `getObservationsPropertyNames` (observation key or keys), and `getProtocolMethodsType` (API endpoint slug).
- Add the protocol id to the `protocol` query string in `SubmittedRecordsMixin.js` so the Submitted page fetches it.
- Add interfaces for the transect, observation, record, submitted record, and validation shapes to `mermaidDataTypes.ts`, and add the record type to the `CollectRecord` union. Mirror the shapes in `mermaidDataProptypes.js` for the `.jsx` files that still use PropTypes.
- Add `data_policy_<protocol>` to the project interface in `mermaidDataTypes.ts` and to the project PropType.

**Done when**

- `getProtocolTransectType`, `getObservationsPropertyNames`, and `getProtocolMethodsType` return the new values for the new protocol id.
- `yarn lint` passes with the new types in place.

**Files**

- `src/types/protocols.ts`
- `src/App/mermaidData/recordProtocolHelpers.ts`
- `src/App/mermaidData/databaseSwitchboard/SubmittedRecordsMixin.js`
- `src/App/mermaidData/mermaidDataTypes.ts`
- `src/App/mermaidData/mermaidDataProptypes.js`

### 3. Add translation keys

Add keys to the English file only. Lokalise owns the other locales and the sync workflow pulls them in; see [TranslationSyncWorkflow](TranslationSyncWorkflow.md) for the process and [TranslationBestPractices](TranslationBestPractices.md) for key naming.

The macroinvertebrate protocol needed these keys. Add the equivalents as each later step needs them:

- `protocol_titles.<protocol>` - the display name, used by the Collect and Submitted lists, the methods filter, the export menu, the Add Sample Unit menu, and data sharing.
- `data_sharing.success.<protocol>_private`, `data_sharing.success.<protocol>_public`, and `data_sharing.success.<protocol>_public_summary` - policy-change toasts. `DataSharing.jsx` builds the key as `` `data_sharing.success.${methodKey}_${policyType}` ``, so these three names are fixed.
- `data_sharing.<protocol>_info` and any metric description keys for the data-sharing info modal.
- A `<protocol>_observations` block for column headers, the propose-species modal, and observation toasts.
- `validation_messages.<name>` entries matching the API validator names for the protocol.

**Files**

- `src/locales/en/translation.json`

### 4. Add the protocol to data-sharing surfaces

A project's data-sharing policy for each protocol appears in four places. Add the new protocol to all four, gated behind the flag.

**What to do**

- `DataSharing.jsx`, edit table: add a gated `<Tr>` of radio inputs bound to `data_policy_<protocol>`. Add a `case 'data_policy_<protocol>'` to the `switch` in `getToastMessageForDataPolicyChange` that calls `getMessageKey('<protocol>', policy)`.
- `DataSharing.jsx`, read-only view: add a gated label and value pair.
- `projectRecordInitialFormValue.js`: add `data_policy_<protocol>` so the project form has an initial value.
- `DataSharingInfoModal.jsx`: add the rows describing what each policy level exposes for the protocol.
- `ProjectCardSummary.jsx`: add a gated `<li data-testid="<protocol>-policy">` in the data-sharing list.

**Done when**

- `Projects.test.tsx` asserts the project card row renders with the flag on. Every project fixture in `mockMermaidData.js` has a `data_policy_<protocol>` value.

**Files**

- `src/components/pages/DataSharing/DataSharing.jsx`
- `src/components/pages/ProjectInfo/projectRecordInitialFormValue.js`
- `src/components/DataSharingInfoModal/DataSharingInfoModal.jsx`
- `src/components/ProjectCard/ProjectCardSummary.jsx`
- `src/App/unitTests/Projects.test.tsx`
- `src/testUtilities/mockMermaidData.js`

### 5. Add the protocol to the methods filter and the export menu

Two components hold a hard-coded list of protocols. Both must learn the new one.

**What to do**

- `MethodsFilterDropDown.tsx`: add `protocol_titles.<protocol>` to `methodKeys` in the agreed position, and filter it out when the flag is off. Update the option counts in `MethodsFilterDropDown.test.tsx` for both the flag-on and flag-off cases.
- `SubmittedToolbarSection.tsx`: add a gated export button that is disabled when `sampleEventCounts.<protocol>` is falsy and calls `handleExportSubmitted('<protocol>')`. `getSampleEventCounts` keys by protocol id, so it needs no change.

**Files**

- `src/components/MethodsFilterDropDown/MethodsFilterDropDown.tsx`
- `src/components/MethodsFilterDropDown/MethodsFilterDropDown.test.tsx`
- `src/components/pages/Submitted/SubmittedToolbarSection.tsx`

### 6. Scaffold the Collect form

Create the form shell first: routes, transect inputs, the save pipeline, and a placeholder observation area. Records of the new protocol can then be created, listed, saved, validated, and deleted before the observation table exists.

**What to do**

- Create `src/components/pages/collectRecordFormPages/<Protocol>Form/` with `<Protocol>Form.tsx`, `<Protocol>TransectInputs.tsx`, `<Protocol>Types.ts`, and `index.ts`. Copy `BeltInvertForm.tsx` as the starting point.
- The form renders the shared `CollectRecordFormPage` and passes it, among other props, `sampleUnitName` (the protocol id), `SampleUnitTransectInputs`, and `sampleUnitFormatSaveFunction`.
- Add `reformatFormValuesInto<Protocol>Record` to `reformatFormValuesIntoRecord.js`. It maps Formik values and observation table state to `{ data: { protocol, <transect key>: {...}, <observation key>: [...] } }`.
- Register the new and edit routes in `routes.jsx`: `/projects/:projectId/collecting/<protocol>` and `/projects/:projectId/collecting/<protocol>/:recordId`.
- Add a gated link to the new route in `AddSampleUnitButton.jsx` with `data-testid="<protocol>-link"`.

**Done when**

- With the flag on, you can create a record of the new protocol from the Collect page, save it, reopen it from the list, and delete it.

**Files**

- `src/components/pages/collectRecordFormPages/<Protocol>Form/` (example: `BeltInvertForm/`)
- `src/components/pages/collectRecordFormPages/CollectRecordFormPage/CollectRecordFormPage.jsx` - the shared page shell. Read it for the prop contract; it should not need changes.
- `src/components/pages/collectRecordFormPages/reformatFormValuesIntoRecord.js`
- `src/App/routes.jsx`
- `src/components/pages/Collect/AddSampleUnitButton.jsx`

### 7. Build the observation table

Replace the placeholder with the full observation table. If the protocol has its own taxonomy, this step also adds the offline sync for it and the propose-new-species flow.

**What to do**

- Add `<Protocol>ObservationTable.tsx` and `<protocol>ObservationReducer.js` to the form folder. The reducer handles add, delete, duplicate, per-field update, and `loadObservationsFromApi`; `BeltInvertObservationTable.tsx` and `beltInvertObservationReducer.js` show the full set.
- Reuse `ObservationSizeSelect.jsx` if the protocol records a size bin. Add an `EditNotesModal.tsx` if observations carry notes.
- Follow the conventions in `BeltInvertObservationTable.tsx`: text columns left-aligned, numeric columns right-aligned, and keyboard handling for moving between rows and editing notes.
- If a transect input changes the meaning of values already entered in observations (for macroinvertebrates, the size bin), ask before clearing them. `BeltInvertTransectInputs.tsx` reuses `ClearSizeValuesModal` from the fish belt form and dispatches `resetObservationSizes` on confirm.

**If the protocol has its own taxonomy**

The API exposes the taxonomy as two sync sources: a read-only hierarchy (`invert_attributes`) and a writable leaf source for proposed species (`invert_species`). The frontend stores both in one IndexedDB table named after the hierarchy source. `pullApiData.js` maps the species source name onto that table, and `SyncApiDataIntoOfflineStorage.js` pushes proposed species to the leaf source and then pulls both (`pushThenPullInvertSpecies`). A new taxonomy needs the same treatment.

- `dexiePerUserDataInstanceContext.jsx`: add the table to `.stores({...})` and increment the number in `.version(n)`. Dexie will not add a table to a database that already exists on a user's machine without a version bump. Mirror the table in `mockDexie.js`.
- `lastRevisionNumbers.js`: add both source names, or pulls never get a revision cursor.
- `pullApiData.js`: map the leaf source name onto the table in `getLocalTableNameForApiDataType`, and add the leaf source to `isAttributeDataTypeWithProposalSupport` so a proposed attribute that a collect record still uses survives a pull that lists it in `removes`.
- `SyncApiDataIntoOfflineStorage.js`: add both names to the pull lists, push modified rows to the leaf source, and add a `pushThenPull<Taxonomy>` method.
- `databaseSwitchboard/<Taxonomy>AttributesMixin.js`: new mixin, modelled on `InvertAttributesMixin.js`. Register it in the `extends` chain in `DatabaseSwitchboard.ts`; a mixin that is written but not registered does nothing.
- `getAttributesInUse.ts`: add the attribute type and the observation key it is counted from.
- `getSelectableAttributes.ts`: hides other users' unapproved proposals from dropdowns. It is generic over the shared status codes (10 proposed, 90 approved), so it needs no change unless the new taxonomy uses different codes. Call it wherever the new table builds its attribute options.
- `NewAttributeModal.tsx`: the propose-new-species modal. It takes a `sampleUnit` prop; `BeltInvertForm.tsx` shows the wiring.
- Test fixtures: add the source to the pull handler in `mockMermaidApiAllSuccessful.js`, a fixture array in `mockMermaidData.js`, and the table in `initiallyHydrateOfflineStorageWithMockData.js`.

**Done when**

- Rows can be added, edited, duplicated, and deleted, and the record saves and validates with observations present.
- If the protocol has a taxonomy: a proposed species appears in the dropdown immediately after submitting the modal, survives a sync, and is hidden from other users until approved.
- The shared sync tests still pass: `pullApiData.test.js`, `lastRevisionNumbers.test.js`, `App.useSyncApiDataIntoOfflineStorage.test.jsx`, and `databaseSwitchboard/tests/ensureAttributesLoaded.test.js`. Each asserts on the list of sync sources or tables.

**Files**

- `src/components/pages/collectRecordFormPages/<Protocol>Form/<Protocol>ObservationTable.tsx`
- `src/components/pages/collectRecordFormPages/<Protocol>Form/<protocol>ObservationReducer.js`
- `src/components/pages/collectRecordFormPages/<Protocol>Form/EditNotesModal.tsx`
- `src/components/pages/collectRecordFormPages/ObservationSizeSelect.jsx`
- `src/components/NewAttributeModal.tsx`
- `src/App/dexiePerUserDataInstanceContext.jsx`
- `src/App/mermaidData/lastRevisionNumbers.js`
- `src/App/mermaidData/pullApiData.js`
- `src/App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage.js`
- `src/App/mermaidData/databaseSwitchboard/<Taxonomy>AttributesMixin.js`
- `src/App/mermaidData/databaseSwitchboard/DatabaseSwitchboard.ts`
- `src/App/mermaidData/getAttributesInUse.ts`
- `src/App/mermaidData/getSelectableAttributes.ts`
- `src/testUtilities/mockDexie.js`
- `src/testUtilities/mockMermaidApiAllSuccessful.js`
- `src/testUtilities/mockMermaidData.js`
- `src/testUtilities/initiallyHydrateOfflineStorageWithMockData.js`

### 8. Build the submitted record view

Add the read-only page for a submitted record: an info table, an observation table, validation display, and any summary metrics computed on the client.

**What to do**

- Create `src/components/pages/submittedRecordPages/Submitted<Protocol>/` with the page, info table, observation table, and `index.js`. Copy `SubmittedBeltInvert/`.
- Register `/projects/:projectId/submitted/<protocol>/:submittedRecordId` in `routes.jsx`. The Submitted list already links to `submitted/<protocol>/<id>`, so it needs no change.
- If the protocol has summary metrics, put the calculation in a pure function under `src/library/<protocol>/` with a unit test, and expose it through a hook. See `calculateGroupOfInterestDensity.ts` and `useBeltInvertDensityMetrics.ts`.
- Render the metrics in a summary component. If it needs a styled variant of `ObservationsSummaryStats`, add it to `table.js` and declare it in `table.d.ts`.

**Done when**

- Opening a submitted record of the new protocol shows the info table, observations, and metrics, and handles a record with no observations.

**Files**

- `src/components/pages/submittedRecordPages/Submitted<Protocol>/` (example: `SubmittedBeltInvert/`)
- `src/library/<protocol>/` (example: `src/library/macroinvertebrates/`)
- `src/components/pages/<Protocol>/<Protocol>SummaryStats.tsx` (example: `BeltInvert/MacroinvertebrateSummaryStats.tsx`)
- `src/components/generic/Table/table.js` and `table.d.ts`
- `src/App/routes.jsx`

### 9. Add integration tests

Mirror the scenarios in `src/App/integrationTests/collectRecords/beltinvert/`: create online and offline, update, delete, submit, validation display, validation ignoring, validation passing, new species, duplicate rows, proposed attribute selectability, dirty form persistence, and the save button group.

**What to do**

- Add `src/App/integrationTests/collectRecords/<protocol>/` with one test file per scenario.
- Add `mockCollectRecords/mock<Protocol>CollectRecords.js` and `mock<Protocol>ValidationsObject.js`, and spread the records into `mockMermaidData.js`.
- Update the shared tests that enumerate protocols. `Collect.test.jsx` asserts the sort order of the Collect list and expects `protocol_titles.<protocol>` to be rendered. `RecordLevelValidationInfo.test.tsx` has a `test.each` list with one observation key per protocol; add `data.<observation key>` to it.

**Done when**

- The full suite passes with the new protocol's records in the shared fixtures.

**Files**

- `src/App/integrationTests/collectRecords/<protocol>/`
- `src/testUtilities/mockCollectRecords/mock<Protocol>CollectRecords.js`
- `src/testUtilities/mock<Protocol>ValidationsObject.js`
- `src/testUtilities/mockMermaidData.js`
- `src/components/pages/Collect/Collect.test.jsx`
- `src/components/pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo.test.tsx`
