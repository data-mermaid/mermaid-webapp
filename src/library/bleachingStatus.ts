import type { TFunction } from 'i18next'

// Bleaching on a Benthic PIT or LIT observation, on the NOAA scale. The ids match
// BLEACHING_STATUS_CHOICES in mermaid-api, which stores the integer. A null or missing
// bleaching_status means the observation was not assessed (shown as NA).
export const BLEACHING_STATUS_NORMAL = 0

const BLEACHING_STATUSES = [
  { id: BLEACHING_STATUS_NORMAL, translationKey: 'bleaching_status.normal' },
  { id: 1, translationKey: 'bleaching_status.pale' },
  { id: 2, translationKey: 'bleaching_status.partially_bleached' },
  { id: 3, translationKey: 'bleaching_status.fully_bleached' },
  { id: 4, translationKey: 'bleaching_status.recent_bleaching_mortality' },
] as const

export const getBleachingStatusOptions = (t: TFunction) =>
  BLEACHING_STATUSES.map(({ id, translationKey }) => ({ value: id, label: t(translationKey) }))

// The "Include bleaching observations" select holds its choice as the strings a select
// produces; the record stores a boolean.
export const INCLUDE_BLEACHING_YES = 'true'
export const INCLUDE_BLEACHING_NO = 'false'

export const toIncludeBleachingFormValue = (isBleachingIncluded?: boolean) =>
  isBleachingIncluded ? INCLUDE_BLEACHING_YES : INCLUDE_BLEACHING_NO

export const isIncludeBleachingOn = (formValue?: string) => formValue === INCLUDE_BLEACHING_YES

// Only observations under these top-level categories take a bleaching status, the same rule
// as the API's BleachingStatusValidator.
const CORAL_CATEGORY_NAMES = ['Hard coral', 'Soft coral']

interface BenthicAttributeOption {
  value: string
  label: string
  topLevelCategory?: string
}

export const getCoralAttributeIds = (benthicAttributeSelectOptions: BenthicAttributeOption[]) => {
  const coralCategoryIds = new Set(
    benthicAttributeSelectOptions
      .filter(({ label }) => CORAL_CATEGORY_NAMES.includes(label))
      .map(({ value }) => value),
  )

  return new Set(
    benthicAttributeSelectOptions
      .filter(
        ({ value, topLevelCategory }) =>
          coralCategoryIds.has(value) || coralCategoryIds.has(topLevelCategory),
      )
      .map(({ value }) => value),
  )
}

interface ObservationWithBleachingStatus {
  attribute?: string
  bleaching_status?: number | null
}

// Both helpers return the same array when nothing changes, so a reducer can apply them on every
// render without looping, and a record that was never assessed is saved as it was.
const mapChangedObservations = <T>(observations: T[], getChanged: (observation: T) => T | null) => {
  let hasChanged = false

  const mappedObservations = observations.map((observation) => {
    const changedObservation = getChanged(observation)

    if (changedObservation === null) {
      return observation
    }

    hasChanged = true

    return changedObservation
  })

  return hasChanged ? mappedObservations : observations
}

// While bleaching is included, a coral observation is Normal until the diver picks a status. This
// only adds statuses, so it is safe to run before the form has finished loading.
export const fillBleachingStatuses = <T extends ObservationWithBleachingStatus>(
  observations: T[],
  coralAttributeIds: Set<string>,
) =>
  mapChangedObservations(observations, (observation) =>
    coralAttributeIds.has(observation.attribute) && (observation.bleaching_status ?? null) === null
      ? { ...observation, bleaching_status: BLEACHING_STATUS_NORMAL }
      : null,
  )

// Bleaching not included: every observation is not assessed.
export const clearBleachingStatuses = <T extends ObservationWithBleachingStatus>(
  observations: T[],
) =>
  mapChangedObservations(observations, (observation) =>
    (observation.bleaching_status ?? null) === null
      ? null
      : { ...observation, bleaching_status: null },
  )
