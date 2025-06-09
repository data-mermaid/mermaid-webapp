# Translation Token Best Practices & Naming Conventions
**Note:** This is a living document and will be updated as we learn more about best practices for translation tokens.

## 1. Hierarchical Structure Using Dot Notation

Organize tokens hierarchically to reflect the application's structure and context. This approach enhances readability and maintainability.

**Format:** `namespace.section.key`

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
In this example, `user_profile.buttons.submit` clearly indicates the token's context within the user profile form.

## 2. Use Descriptive and Purposeful Names

Token names should convey their purpose without relying on the actual text content. Avoid vague or overly generic names.

**Good Examples:**

- ✅`navigation.menu.home`
- ✅`error_messages.network.timeout`

**Poor Examples:**

- `text1`
- `label`

## 3. Naming Conventions

- **snake_case:** `classifier_guess`
Use snake_case for token names and opt for naming that is descriptive of the text intentions. Do not use numbers, spaces, special characters, or abbreviations that are not widely recognized.
- ❌ citation_1_header: "Included in this export",
- ✅ included_in_export: "Included in this export"

Tokens should relay the context of the original text without being overly specific. More broadly scoped context and naming will provide better reusability and flexibility of the tokens.


## 4. Incorporate Contextual Information

When a term might have multiple meanings, include additional context to clarify its usage.

**Example:**

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

## 5. Plan for Plurals and Gender Variations
Different languages have different ways of grouping numbers. These variations can be handled by adding plural forms to our tokens. Plural forms are utilized by a token base value (such as ‘click_message’) appended with a plural form suffix (‘click_message_one’, 'click_message_other').

Structure your tokens to accommodate pluralization and gender variations, which are common in localization.

**Example:**

```json
{
  "notifications": {
    "user_messages_one": "You have 1 new message",
    "user_messages_other": "You have {{count}} new messages"
  }
}
```

Passing the count in the code:
```typescript jsx
t('notifications.user_messages', { count: 5 });
```
i18next will automatically select the correct plural form based on the count provided.

## 6. Namespace Organization
Namespace - The location of specificity for your translations. Commonly, the file name for your translations.
Organize translation files by namespaces corresponding to application modules or features. This modular approach
simplifies management and scalability.

Example: Keeping our user messages in one translation file called ‘user_messages.json’, and our menu options in a file named ‘menu_options.json’

**File Structure:**

```
locales/
├── en/
│   ├── user_profile.json
│   └── dashboard.json
├── es/
│   ├── user_profile.json
│   └── dashboard.json
```

Avoid nesting namespaces more than 2 levels deep to help keep the translation files clean and easy to navigate.

```
❌ observations.bpq.toolnavbar.validatebutton
✅ buttons.validate: 'Validate'
```

# Best Practices
Providing good context in naming will provide translators more accurate understanding of what words would be most
appropriate for the translation, without screenshots for every line.

Prevent duplicates - Check existing tokens in the language files before adding a new one.

** Examples: **

- ❌imageClassification.button2: ‘Save now’
- ✅buttons.save_now: ‘Save now’
- ✅explore_module.add_new_location

Translations of this highly depends on the context, as 'Add' can be synonymous with multiple words even in English.
- ❌add: 'Add'
- ✅add_record: 'Add Record'
- ✅add_record: 'Add'