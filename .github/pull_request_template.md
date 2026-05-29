---Every PR---

- [ ] Changes have been tested locally
- [ ] Lint has run and any errors have been resolved
- [ ] Prettier has run on any changed files
- [ ] Unit tests have run and passed

---Transitional Changes---

- [ ] Any hard-coded text in the file(s) worked has been refactored into key-value tokens
- [ ] Any language.js tokens no longer used are removed
- [ ] Any necessary updates to the documentation have been made
- [ ] Unit tests have been added or updated, where possible, to prevent future regressions
- [ ] styled-components code in changed files has been updated to CSS modules in the styles folder
- [ ] Touched JS files are migrated to TypeScript where in scope; PropTypes are replaced with TypeScript interfaces in converted files and not added for shapes already typed in `mermaidDataTypes.ts`.

---Post-Merge---

- [ ] Code has merged and build success is confirmed in 'Actions'
- [ ] The corresponding Trello ticket has moved to the appropriate list (likely User-QA)
