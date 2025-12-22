# Translation Token Naming Conventions

**Note:** This is a living document and will be updated as we learn more about best practices for translation tokens.

## 1. Casing

Use lower-case snake casing for all tokens.

- **snake_case:** `classifier_guess`

## 2. Avoid numbers and special characters

Similar to variable names, do not use numbers or special characters in key names.

**Poor Examples:**

- `text1`
- `label`
- `@aria-label`

## 3. Incorporate contextual information and hierarchy

When a term might have multiple meanings, include additional context to clarify its usage.
More broadly scoped context and naming will provide better reusability and flexibility of the tokens.
Providing good context in naming will provide translators more accurate understanding of what words would be most appropriate for the translation, without screenshots for every line.
**Example:**
Organize tokens hierarchically to reflect the contextual structure. This approach enhances readability and maintainability.

**Code implementation:** `section.section.key`

**Example:**

```json
{
  "user_profile": {
    "buttons": {
      "update_permissions": "Update user permissions",
      "mark_user_obsolete": "Mark user as obsolete"
    }
  }
}
```

**Good Examples:**

- `navigation.menu.home`
- `error_messages.network.timeout`

```json
{
  "account": {
    "settings": "Account Settings"
  },
  "application": {
    "settings": "Application Settings"
  }
}
```

In this example, `user_profile.buttons.submit` indicates the token's context within the user profile form.
If a token is used in multiple locations, it can have a more generic context.

**Example:**

```json
{
  "user_profile": {
    "buttons": {
      "update_permissions": "Update user permissions",
      "mark_user_obsolete": "Mark user as obsolete"
    }
  }
}
```

## 4. Avoid embedding actual text in keys

Do not use the actual display text as the token key. This practice hinders flexibility and can complicate future text changes. Tokens should relay the context of the original text without relying on the actual text content.

**Instead of:**

```json
{
  "bleaching_is_now_set_public_summary": "Bleaching is now set to public summary"
}
```

**Use:**

```json
{
  "bleaching_public_summary": "Bleaching is now set to public summary"
}
```

## 5. Plurals

Different languages have different ways of grouping numbers. These variations can be handled by adding plural forms to our tokens. Plural forms consist of a token base value appended with a plural form suffix.
Plural suffixes are designed by CLDR to provide standardization across different language needs.
Adding a reserved suffix will indicate a plural to the translation management program, and cause UI breaks if used incorrectly on non-plurals.
**Example:**

```json
{
  "notifications": {
    "user_messages_one": "You have 1 new message",
    "user_messages_other": "You have {{count}} new messages"
  }
}
```

Reserved suffix values: `zero`, `one`, `two`, `few`, `many`, `other`

(CLDR Plural rules)[https://cldr.unicode.org/index/cldr-spec/plural-rules]
(CLDR - Language-specific plural rules)[https://www.unicode.org/cldr/charts/47/supplemental/language_plural_rules.html]

## 6. Prevent duplicates

Check existing tokens in the language files before adding a new one.

Avoid nesting namespaces more than 2 levels deep to help keep the translation files clean and easy to navigate.

** Examples: **

- ❌imageClassification.button2: ‘Save now’
- ✅buttons.save_now: ‘Save now’
- ✅explore_module.add_new_location

Translations of this highly depends on the context, as 'Add' can be synonymous with multiple words even in English.

- ❌add: 'Add'
- ✅add_record: 'Add Record'
- ✅add_record: 'Add'

## 7. Adding HTML

Integrate HTML using the (`Trans` component)[https://react.i18next.com/latest/trans-component]

## 8. QAing tokens

## 9. Unit testing
