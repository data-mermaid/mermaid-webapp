/**
 * Marks a site or management regime so the API creates it even if it looks like a duplicate.
 *
 * The API rejects a new site or management regime that resembles one with submitted data, unless
 * ignore_duplicate_warning is set. That check is for clients that create them directly. Collect
 * flags duplicates when a collect record using them is validated, and offers to merge them there.
 * The API only reads the flag on creation, so it's safe on every push.
 */
export const skipApiDuplicateCheck = <T extends object>(siteOrManagementRegime: T) => ({
  ...siteOrManagementRegime,
  ignore_duplicate_warning: true,
})
