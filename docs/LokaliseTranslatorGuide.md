# Lokalise Translator Guide (MERMAID)

For anyone translating and reviewing in Lokalise. This is the Lokalise-side companion to the developer-facing [Translation Sync Workflow](./TranslationSyncWorkflow.md).

## Your role

Translate and review the target languages in Lokalise. The codebase automatically pulls **reviewed** translations back on a schedule - you don't touch the code. English is the source of truth and comes from the developers, so you don't author English here (beyond minor normalization - see below).

The current focus is **Bahasa Indonesia**, with Portuguese planned. Spanish, French, and Tagalog also exist in the project and flow back to the app once reviewed.

## The key action: mark **Reviewed**

> **Current status:** the reviewed-only filter is **temporarily off** while we get the languages fully reviewed. Right now, *all* translations sync to the app regardless of review status. **Keep marking translations Reviewed anyway** - the goal is to get every relevant language fully reviewed, and once that's done the filter gets switched on.

Once the filter is enabled, a translation only reaches the app once you mark it **Reviewed** in Lokalise:

- Edit or add a translation → it stays in Lokalise, not yet in the app.
- Mark it **Reviewed** → it's included in the next pull to the code.
- Anything left unreviewed doesn't reach a pull request.

Note: after you mark something Reviewed, allow a few minutes before expecting it in a pull - Lokalise's export can lag briefly.

## How your work reaches the app

- **Weekly:** every Monday, an automated job pulls translations into a pull request against the code.
- **On demand:** for time-sensitive changes, run the pull yourself instead of waiting for Monday - GitHub → **Actions** → "Pull Translations from Lokalise" → **Run workflow** (branch `develop`).

Reviewing and merging that pull request is **your responsibility** - see [Reviewing and merging the translation PR](#reviewing-and-merging-the-translation-pr) below.

## Reviewing and merging the translation PR

When the pull runs, it opens a pull request on GitHub containing the translation changes. Getting it reviewed, merged, and live is **your responsibility**:

1. **Open the PR** in GitHub - it's on the branch `chore/lokalise-translations` and labelled `i18n` and `automated`.
2. **Review the changes** - look through the diff (the "Files changed" tab) and confirm the translations look correct and nothing unexpected changed.
3. **Approve** the pull request.
4. **Merge** it into `develop`.
5. **Wait for the deploy** - merging kicks off a deploy automatically. Watch the **Actions** tab in GitHub; once the run finishes (green check), the changes are live on the dev environment.

If the diff looks wrong, fix the translation in Lokalise and re-run the pull (it updates the same PR) rather than editing the PR by hand - that keeps Lokalise as the source of truth for translations.

## New tokens from feature work

When developers add new UI text, those tokens appear in Lokalise as English source, get machine-translated (Google Translate / DeepL), and are marked **unverified**. Review them for accuracy and mark them **Reviewed** to release.

Developers no longer change existing English text (see below) - if wording needs to change, they either ask for it to be done in Lokalise or add a **new** token, which arrives like any other new token.

## English source - hands off (mostly)

- For **new** keys, English in the code is the source of truth - developers add them to `src/locales/en/translation.json` and the push sends them up to Lokalise.
- For **existing** keys, **Lokalise is the source of truth for the English text** - the pull overwrites `en/translation.json` with Lokalise's export, so English normalization done in Lokalise flows back into the code.

**Your English edits in Lokalise are safe.** The push only ever *adds* new tokens; it does not write existing English values back over yours. Edit English punctuation and wording in Lokalise and it stays put until the next pull carries it into the code.

> Until August 2026 this was not true: the push overwrote every English value on each merge to `develop`, so English edits made in Lokalise were silently reset before the weekly pull could collect them. That is fixed (`replace_modified: false`).

Two things still have to come from the code rather than from Lokalise, because they are part of how the app renders the string, not a wording choice:

- **Placeholders** like `{{count}}` or `{{userName}}`.
- **Inline markup** like `<br />`, `<strong>`, `<helperTextLink>` or `$t(...)`.

Leave those exactly as they are. If one looks wrong, raise it with a developer rather than editing or deleting it - a placeholder that no longer matches the code renders as broken text in the app. Developers handle these by adding a **new** token, which will appear in Lokalise for you to translate.

Everything else (capitalization, punctuation, wording tidy-ups) is yours to change directly in Lokalise.

## Previewing Indonesian (QA)

On the **dev** app (not production), a language picker appears in the header. Switch between English and Bahasa Indonesia to check translations in context and spot missing or incorrect values. Missing translations show English - that's the expected fallback, not a bug.

## The old Lokalise → GitHub options are disabled

The old native Lokalise↔GitHub integration was retired, and its "push / download to GitHub" build options in Lokalise are now disabled. Delivery is handled entirely by the automated pull - if you need translations out sooner, run the pull yourself (see [How your work reaches the app](#how-your-work-reaches-the-app)) instead of waiting for the weekly run.

## Quick reference

- **Right now:** all translations sync regardless of status (reviewed-only filter temporarily off). Keep marking **Reviewed** to work toward enabling it.
- Once the filter is on: edit **and mark Reviewed** = releases to the next pull.
- Weekly pull = Monday; need it sooner = run the pull yourself (Actions → Run workflow).
- Missing translation → the app shows English (expected).
- English source comes from code; normalization-only in Lokalise.
