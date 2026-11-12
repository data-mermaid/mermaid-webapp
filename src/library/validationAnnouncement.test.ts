import { expect, test } from 'vitest'
import { getIsEligibleForValidationAnnouncement } from './validationAnnouncement'

const existingUser = {
  id: 'existing-user',
  created_on: '2026-11-15T23:59:59Z',
  first_name: '',
  last_name: '',
  full_name: '',
  email: '',
}
const seenKey = 'validation-release-announcement-seen:existing-user'

test('an account created before the release is eligible until it has seen the announcement', () => {
  expect(getIsEligibleForValidationAnnouncement(existingUser)).toBe(true)

  localStorage.setItem(seenKey, 'true')

  expect(getIsEligibleForValidationAnnouncement(existingUser)).toBe(false)
})

test('seen is kept per person', () => {
  localStorage.setItem(seenKey, 'true')

  expect(getIsEligibleForValidationAnnouncement({ ...existingUser, id: 'someone-else' })).toBe(true)
})

test('an account created on or after the release, or with no created date, is not eligible', () => {
  const onReleaseDay = { ...existingUser, created_on: '2026-11-16T00:00:00Z' }
  const withoutCreatedDate = { ...existingUser, created_on: undefined }

  expect(getIsEligibleForValidationAnnouncement(onReleaseDay)).toBe(false)
  expect(getIsEligibleForValidationAnnouncement(withoutCreatedDate)).toBe(false)
})
