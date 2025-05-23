# Best Practices
Tokens should relay the context of the original text without being overly specific. More broadly scoped context and naming will provide better reusability and flexibility of the tokens.

Providing good context in naming will provide translators more accurate understanding of what words would be most appropriate for the translation, without screenshots for every line.

Prevent duplicates - Check existing tokens in the language files before adding a new one.

Avoid nesting namespaces more than 2 levels deep to help keep the translation files clean and easy to navigate.

## Examples:
- ❌imageClassification.button2: ‘Save now’
- ✅buttons.save_now: ‘Save now’
- ✅explore_module.add_new_location


❌add: 'Add'

Translations of this highly depends on the context, as 'Add' can be synonymous with multiple words even in English.
- ✅addRecord: 'Add Record'
- ✅addRecord: 'Add'

# Namespaces
The location of specificity for your translations. Commonly, the file name for your translations.

Example: Keeping our user messages in one translation file called ‘userMessages.json’, and our menu options in a file named ‘menuOptions.json’

# Plurals
Different languages have different ways of grouping numbers. These variations can be handled by adding plural forms to our tokens. Plural forms are utilized by a token base value (such as ‘click_message’) appended with a plural form suffix.

 _This is a living document, and will be updated as we learn more about the best practices for translation tokens_