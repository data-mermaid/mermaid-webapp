# Translation Sync Workflow (Lokalise ↔ GitHub)

How English source and translated strings move between the codebase and Lokalise. Companion to [TranslationBestPractices.md](./TranslationBestPractices.md) (token naming/authoring) and the [Lokalise Translator Guide](./LokaliseTranslatorGuide.md) (for the Lokalise side).

## Overview

- English is the **source of truth for new keys**, in `src/locales/en/translation.json` - developers add them in code and the push sends them up to Lokalise.
- **Lokalise is the source of truth for existing keys' English** - the pull overwrites `en/translation.json` with Lokalise's export, so English normalization done there flows back into the code. The push **never** sends existing English values back up (`replace_modified: false`), so a translator's edit is not at risk from the next merge to `develop`. See [Changing the English text of an existing token](#changing-the-english-text-of-an-existing-token).
- Target-language values are authored and **reviewed in Lokalise**, then pulled back.
- Two token-based GitHub Actions do the sync, using the `LOKALISE_API_TOKEN` and `LOKALISE_PROJECT_ID` secrets:
  - **Push** (`.github/workflows/lokalise-push.yml`) - uploads English source to Lokalise, automatically on merge to `develop` (plus a manual option).
  - **Pull** (`.github/workflows/lokalise-pull.yml`) - downloads translations as a PR, automatically every week (plus a manual option).

Both directions run automatically - the **push** fires whenever English source lands on `develop`, and the **pull** runs on a **weekly** schedule. **The automation doesn't replace manual control: either workflow can also be run on demand at any time** (see [Triggering manually](#triggering-manually)) - handy for backfilling source or pulling time-sensitive translations without waiting for the schedule.

## Workflow steps

```mermaid
flowchart LR
    Ticket --> Code --> Lokalise --> PR[Export to PR] --> Live
```

1. **Ticket** - On a requested feature, any verbiage for the website is turned into key:value pairs. The developer adds the tokens to `src/locales/en/translation.json` (see [naming conventions](./TranslationBestPractices.md)).
2. **Code** - The code is merged upon approval to `develop`. The push workflow then **automatically uploads new English tokens to Lokalise** whenever `src/locales/en` changes on `develop`. Existing tokens are left as they are in Lokalise. (It can also be run manually via workflow dispatch, e.g. to backfill.)
3. **Lokalise** - Automations run for the translation tokens:
   - Google Translate / DeepL provide machine translations for the new values.
   - Statuses on changed tokens are cleared, and new tokens are set to **unverified**.
   - A translator reviews each value and marks it **Reviewed**. Marking Reviewed is what controls release once the reviewed-only filter is enabled - though that filter is **currently disabled** (see [Reviewed-only filter](#reviewed-only-filter-currently-disabled) below), so for now all translations pull back regardless of status.
4. **Export to PR** - Translations are pulled **weekly (Mondays 09:00 UTC)**, or **on demand** via manual trigger, into a PR against `develop` (branch `chore/lokalise-translations`). Review the diff, but **fix problems in Lokalise and re-run the pull** rather than editing the branch: it is force-pushed on every run, so hand edits are discarded and never reach Lokalise.
5. **Live** - Merged verbiage reaches the production environment through the normal release process.

## Push: code → Lokalise

- Uploads the **English base language only** (translations live in Lokalise).
- Runs **automatically on merge to `develop`** when `src/locales/en/**` changes, plus **on demand** (`workflow_dispatch`).
- **Adds new keys only.** `replace_modified: false` means the English text of keys that already exist in Lokalise is left untouched. This is the whole point of the push: new tokens go up, and nothing a translator has written comes down. See [Critical configuration](#critical-configuration-and-why).
- `convert_placeholders: false` keeps i18next `{{interpolation}}` and custom tags (`<helperTextLink>`, `$t(...)`) intact.
- `use_tag_tracking: true` (creates a `lokalise-upload-complete` git tag) so multi-commit pushes detect every changed file.
- **Never deletes keys.** It also re-creates any key that is in `en` but missing from Lokalise, so deleting a key in Lokalise while it is still in code does not stick. See [Removing a token](#removing-a-token).
- Because the push uploads the whole file, it is a no-op for existing keys: Lokalise reports them as _skipped_, not _updated_. A push triggered by merging the pull PR is therefore harmless.

## Pull: Lokalise → code

- Opens a PR against `develop` (branch `chore/lokalise-translations`, labels `i18n,automated`).
- Runs **weekly (Mondays 09:00 UTC)** and **on demand** (`workflow_dispatch`). The PR body says "Automated weekly pull" vs "Manual pull" depending on the trigger.
- **Reuses the `chore/lokalise-translations` branch** when it already exists on the remote. The action checks that branch out, writes Lokalise's export over it, commits only if the files differ, and pushes (`force_push: true`). It never rebuilds the branch from `develop`: the branch keeps the base it was first created from until it is merged or deleted. A rerun after `develop` has moved therefore shows `develop`'s own changes in the PR's compare view, and reports "No changes detected" if the export already matches the branch. **Nobody edits this branch** - all corrections go back through Lokalise - so deleting it and rerunning is always safe (see [Troubleshooting](#troubleshooting)).
- **Overwrites** the locale files with what Lokalise exports (it does not merge). The app falls back to English for anything missing.
- **Includes English** via `always_pull_base: true` - without it the action drops base-language changes and `en/translation.json` never updates (see [Critical configuration](#critical-configuration-and-why)).
- Pulls **all enabled languages** (currently `en`, `id`, `es`, `fr`, `pt`, `tl`).

### Reviewed-only filter (currently disabled)

The intended design is to export **reviewed-only** strings (`filter_data: ["reviewed_only"]`), so only translations a human has marked **Reviewed** reach the code. Because the pull overwrites, that also means any string _not_ marked Reviewed would be dropped from the repo (the app then shows English).

**The filter is currently disabled** - the `filter_data` option has been removed from the pull config, so the pull brings back **all** translations regardless of review status. This is deliberate: while the languages are still being reviewed, turning the filter on would strip the app of every not-yet-reviewed string. The filter will be **re-enabled once all relevant languages are fully reviewed**, by re-adding `"filter_data": ["reviewed_only"]` to the pull's `additional_params` - at which point nothing is dropped because everything is reviewed.

## Critical configuration (and why)

- **`replace_modified: false`** (push config) - the push action **defaults this to `true`**, which overwrites the English text of _every_ key already in Lokalise with this repo's value. Because the whole file is uploaded, a single new token added by a developer was enough to reset every punctuation and wording edit a translator had made since the last pull. Setting it to `false` restores Lokalise's default behaviour: new keys are inserted, existing keys are skipped. Do **not** use the action's `skip_default_flags` input to achieve this - that would also drop `include_path` and `distinguish_by_file`, breaking the key-filename mapping below.
- **Key filenames must be `src/locales/%LANG_ISO%/translation.json`.** This is what maps Lokalise files to the repo. Bare filenames (e.g. `translation.json`) silently break the pull with "No changes detected". Set in Lokalise via bulk **File: assign**.
- **`always_pull_base: true`** (pull config) - the pull action **defaults this to `false`**, which silently drops base-language (English) changes: target languages sync but `en/translation.json` is never updated. It **must** be set to `true` for Lokalise's English source-of-truth edits on existing keys to flow back (see [Pull](#pull-lokalise--code)).
- **`force_push: true`** (pull config) - lets a run overwrite the remote `chore/lokalise-translations` branch. It does not rebase the branch onto `develop`; the action reuses the existing branch and commits on top of it (see [Pull](#pull-lokalise--code)). Safe because the branch is never hand-edited (corrections are made in Lokalise).
- **`plural_format: i18next_v4`** - matches the code's `_one` / `_other` plural keys (i18next v4). The older `i18next` (v3, `_plural`) would break pluralization.
- **`json_unescaped_slashes: true`** - exports `/` instead of `\/`, matching the repo and prettier (avoids diff noise).
- **`filter_data: ["reviewed_only"]`** - the reviewed-only filter, **currently disabled/removed** (see [Reviewed-only filter](#reviewed-only-filter-currently-disabled)). `export_empty_as: skip`, `export_sort: a_z`, 2-space indent.
- **`fallbackLng: 'en'`** (in `i18n.ts`) - any missing translation renders English, so the UI degrades to English rather than breaking.

## Changing the English text of an existing token

Adding and renaming tokens in code is business as usual, and removing one starts in code (see [Removing a token](#removing-a-token)). **Rewording an existing token in code is not**, because the pull overwrites `en/translation.json` with Lokalise's export: the edit would be reverted the following Monday rather than shipped.

The `Guard English Translation Source` check (`.github/workflows/i18n-source-guard.yml`) fails any PR that rewords an existing token, and prints the offending keys. Run it locally with:

```bash
yarn check:i18n-source "$(git merge-base origin/develop HEAD)"
```

Pick whichever case applies:

| Situation                                                            | What to do                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Rewording, typo or punctuation fix                                   | Make the change **in Lokalise**. The weekly pull brings it back, and target languages get re-reviewed at the same time.                                                                                                                                                                                                                                      |
| Changing `{{interpolation}}` or inline markup (`<br />`, `<strong>`) | **Add a new token** and point the code at it. Never edit the old one: a token whose placeholders no longer match the code renders broken text as soon as Lokalise reasserts the old string. Once nothing references the old token, remove it from `en` in the same PR and delete it in Lokalise after the merge (see [Removing a token](#removing-a-token)). |
| Turning an existing token into a plural (`_one` / `_other`)          | **Use a new base name**, as for a placeholder change. Lokalise reads `key_one` / `key_other` as plural forms of `key`, so if `key` already exists the push skips them and the next pull drops both forms from `en`. The source guard can't catch this, because the suffixed names look like new keys.                                                        |

**There is deliberately no override.** The push has no mode that sends a reworded value up, so every case is covered by one of the rows above. The only exemption is the `chore/lokalise-translations` branch, which is how Lokalise's own rewording is meant to arrive.

Note that the check is currently **advisory**: `develop`'s branch protection has no required status checks, so a failing run shows a red mark but does not hard-block the merge. Add `check-en-source-edits` to the required checks if you want it enforced.

## Removing a token

A token exists in two places, and the sync never deletes it from either. Remove it from both, in this order:

1. **Code first.** Delete the key from `src/locales/en/translation.json` in the PR that stops using it. Leave the other language files alone: the next pull rewrites them.
2. **Lokalise second, after the merge.** Delete the key in Lokalise. The next pull then drops it from every language file.

The order matters because each direction restores a key the other side still has:

- Deleted in Lokalise while still in `en`: the next merge that touches `src/locales/en/**` uploads the whole file, Lokalise re-creates the key, and its automations machine-translate it again.
- Deleted in `en` while still in Lokalise: the next pull PR adds it back to `en`. A key the pull PR adds is an orphan: delete it in Lokalise and re-run the pull.

Never leave a replaced key in `en` "for removal in Lokalise later". It survives every deletion made there.

## Triggering manually

Both workflows keep their automatic triggers **and** stay available to run by hand whenever you need to - the automation is in addition to, not instead of, manual runs. Actions → select the workflow → **Run workflow** (branch `develop`), or:

```bash
gh workflow run lokalise-pull.yml --ref develop
gh workflow run lokalise-push.yml --ref develop
```

## Troubleshooting

- **Pull reports "No changes detected" but you expect changes** - almost always a filename mismatch: keys must carry the `src/locales/%LANG_ISO%/` prefix. Also remember only **Reviewed** strings are pulled.
- **Pull PR deletes many translations** - this happens when the reviewed-only filter is on but those strings aren't marked Reviewed (overwrite + reviewed-only). The filter is currently disabled to avoid exactly this; before re-enabling it, mark all needed strings Reviewed first.
- **Escaped-slash or plural churn in a PR** - check `json_unescaped_slashes` and `plural_format` in the pull config.
- **A just-reviewed string isn't in the pull** - Lokalise export can lag a few minutes after the Reviewed flag is set; re-run the pull.
- **English edits made in Lokalise don't reach the repo (but target languages do)** - the pull's `always_pull_base` is `false` (its default). It must be `true`, or the action silently drops all base-language changes.
- **English edits made in Lokalise get reset to the old wording** - the push's `replace_modified` is `true` (the action's default). It must be `false`. With it on, any merge to `develop` that touches `src/locales/en/**` re-uploads the whole file and overwrites every English value in Lokalise, so edits made since the last pull are lost before they can be pulled back.
- **The pull PR shows changes `develop` already has**, or an old merge base - the branch was created from an older `develop` and the action reuses it on every run. Delete the remote branch, which closes its PR, and rerun the pull; it creates the branch from the current `develop`:

  ```bash
  git push --no-verify origin --delete chore/lokalise-translations
  gh workflow run lokalise-pull.yml --ref develop
  ```

- **A key I deleted keeps coming back** - it was deleted in one place only. The push re-creates any key in `en` that Lokalise lacks, and the pull re-adds any key Lokalise has that `en` lacks. See [Removing a token](#removing-a-token).
- **New `_one` / `_other` keys never appear in Lokalise** - the base name already exists there as a regular key. Rename the pair to a new base name. See [Changing the English text of an existing token](#changing-the-english-text-of-an-existing-token).
- **A copy fix made in code disappeared after the weekly pull** - expected: Lokalise owns the English wording of existing tokens. See [Changing the English text of an existing token](#changing-the-english-text-of-an-existing-token).
- **The `Guard English Translation Source` check is failing** - the PR rewords a token that already exists. The job log lists the offending keys. Either make the change in Lokalise instead, or add a new token; there is no bypass.

## Languages and rollout phases

The translation process was introduced in phases:

1. **Tokenization** - developers tokenize the UI codebase. During this phase, only **text normalization** (capitalization, etc.) of English is accepted in Lokalise, to prevent merge conflicts. Machine translations are reviewed to confirm the accuracy of the translation engine in use.
2. **Fully tokenized UI** - verbiage updates that have been discussed/vetted by the team (through tickets or other means) can be proposed through Lokalise. Time-sensitive updates go out with an **on-demand pull run** (this replaces the retired integration's "build button").

Current language focus is **Bahasa Indonesia (`id`)**, with Portuguese planned. Spanish, French, and Tagalog translations also exist in Lokalise and flow back once reviewed. On non-production environments, a language picker in the header (`LanguageMenuTool` in `src/components/Header/Header.jsx`) lets QA preview English vs Bahasa Indonesia in context.

## Adding a language

Enable it in Lokalise and ensure its keys carry the `src/locales/%LANG_ISO%/translation.json` filename. The pull will then write reviewed strings to `src/locales/<lang>/translation.json`. Wire the language into the app's i18n config / language picker as needed.

## History

The previous native Lokalise↔GitHub OAuth integration (which created manual "push to GitHub" PRs named `lokalise-<timestamp>`, triggered by the Download page's build button) was retired in favour of the two token-based Actions above.
