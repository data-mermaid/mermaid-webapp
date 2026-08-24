#!/usr/bin/env node
/**
 * Fails when a change edits the English text of a token that already exists in
 * src/locales/en/translation.json.
 *
 * Lokalise owns the English wording of existing tokens: the weekly pull writes
 * its export back into this file, and the push deliberately never overwrites it
 * (`replace_modified: false`). An edit made here would therefore be silently
 * reverted by the next pull. Adding, renaming and removing tokens is unaffected.
 *
 * Usage: node scripts/check-en-source-edits.mjs <base-ref>
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const SOURCE_FILE = 'src/locales/en/translation.json'

const baseRef = process.argv[2]

if (!baseRef) {
  console.error('Usage: node scripts/check-en-source-edits.mjs <base-ref>')
  process.exit(2)
}

const flatten = (value, prefix = '', into = {}) => {
  for (const [key, val] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      flatten(val, path, into)
    } else {
      into[path] = val
    }
  }

  return into
}

const readAtRef = (ref) => {
  try {
    return execFileSync('git', ['show', `${ref}:${SOURCE_FILE}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return null
  }
}

const baseRaw = readAtRef(baseRef)

if (baseRaw === null) {
  console.log(`${SOURCE_FILE} does not exist at ${baseRef}, nothing to compare.`)
  process.exit(0)
}

const base = flatten(JSON.parse(baseRaw))
const head = flatten(JSON.parse(readFileSync(SOURCE_FILE, 'utf8')))

const edited = Object.keys(head).filter((key) => key in base && base[key] !== head[key])

if (edited.length === 0) {
  console.log(`No existing English tokens were reworded in ${SOURCE_FILE}.`)
  process.exit(0)
}

console.log(
  `::error file=${SOURCE_FILE}::${edited.length} existing token(s) had their English text changed. Lokalise owns this wording, so the next pull will revert it. See the job log for details.`,
)

console.error(
  `\n${edited.length} existing token(s) had their English text changed in ${SOURCE_FILE}:\n`,
)

for (const key of edited) {
  console.error(`  ${key}`)
  console.error(`    before: ${JSON.stringify(base[key])}`)
  console.error(`    after:  ${JSON.stringify(head[key])}`)
}

console.error(`
Lokalise is the source of truth for the English text of tokens that already
exist. The weekly pull overwrites this file with Lokalise's export, so an edit
made here is reverted rather than shipped. Pick whichever applies:

  Rewording only
    Make the change in Lokalise instead. The weekly pull brings it back into
    this file, and the target languages get re-reviewed at the same time.

  Changing {{interpolation}} or inline markup
    Add a NEW token and point the code at it, rather than editing this one.
    A token whose placeholders no longer match the code renders broken text
    once Lokalise reasserts the old string. The stale token can be removed in
    Lokalise once nothing references it.

There is no override: the push cannot send a reworded value to Lokalise, so
the change has to take one of the two routes above.

See docs/TranslationSyncWorkflow.md for the full workflow.`)

process.exit(1)
