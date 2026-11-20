import type { TFunction } from 'i18next'

// The ids match BLEACHING_STATUS_CHOICES in mermaid-api. A null or missing bleaching_status is
// NA: not assessed, not coral, or a coral observation whose bleaching wasn't recorded.
export const BLEACHING_STATUS_NORMAL = 0

const BLEACHING_STATUSES = [
  { id: BLEACHING_STATUS_NORMAL, translationKey: 'bleaching_status.normal' },
  { id: 1, translationKey: 'bleaching_status.pale' },
  { id: 2, translationKey: 'bleaching_status.partially_bleached' },
  { id: 3, translationKey: 'bleaching_status.fully_bleached' },
  { id: 4, translationKey: 'bleaching_status.recent_bleaching_mortality' },
] as const

const NA_OPTION_VALUE = ''

/** The options a coral observation's Bleaching select offers: the five statuses, then NA. */
export const getBleachingStatusOptions = (t: TFunction) => [
  ...BLEACHING_STATUSES.map(({ id, translationKey }) => ({ value: id, label: t(translationKey) })),
  { value: NA_OPTION_VALUE, label: t('bleaching_status.na') },
]

/** The status to store for a Bleaching select value. NA is mapped first: `Number('')` is Normal. */
export const parseBleachingStatusValue = (optionValue: string) =>
  optionValue === NA_OPTION_VALUE ? null : Number(optionValue)

// Formik holds a select's value as a string; the record stores a boolean.
export const INCLUDE_BLEACHING_YES = 'true'
export const INCLUDE_BLEACHING_NO = 'false'

export const toIncludeBleachingFormValue = (isBleachingIncluded?: boolean) =>
  isBleachingIncluded ? INCLUDE_BLEACHING_YES : INCLUDE_BLEACHING_NO

export const isIncludeBleachingOn = (formValue?: string) => formValue === INCLUDE_BLEACHING_YES

// The same rule as the API's BleachingStatusValidator.
const CORAL_CATEGORY_NAMES = ['Hard coral', 'Soft coral']

interface BenthicAttributeOption {
  value: string
  label: string
  topLevelCategory?: string
}

/** Ids of the Hard coral and Soft coral categories and every attribute under them. */
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

/**
 * Sets every coral observation with no status to Normal. Call it only when bleaching is switched
 * on: afterwards, a coral observation with no status is one the diver set to NA.
 */
export const fillBleachingStatuses = <T extends ObservationWithBleachingStatus>(
  observations: T[],
  coralAttributeIds: Set<string>,
) =>
  observations.map((observation) =>
    coralAttributeIds.has(observation.attribute) && (observation.bleaching_status ?? null) === null
      ? { ...observation, bleaching_status: BLEACHING_STATUS_NORMAL }
      : observation,
  )

/**
 * An observation's status after its attribute changes: NA if the new attribute is not coral,
 * Normal if it has just become coral, and unchanged (NA included) between two coral attributes.
 */
export const getBleachingStatusAfterAttributeChange = (
  { attribute, bleaching_status: bleachingStatus }: ObservationWithBleachingStatus,
  newAttribute: string,
  coralAttributeIds: Set<string>,
) => {
  if (!coralAttributeIds.has(newAttribute)) {
    return null
  }

  return coralAttributeIds.has(attribute) ? (bleachingStatus ?? null) : BLEACHING_STATUS_NORMAL
}

/**
 * Coral observations that switching bleaching off would change: any status but Normal. NA counts
 * because switching back on fills every coral observation with no status with Normal.
 */
export const countStatusesLostOnTurnOff = (
  observations: ObservationWithBleachingStatus[],
  coralAttributeIds: Set<string>,
) =>
  observations.filter(
    ({ attribute, bleaching_status: bleachingStatus }) =>
      coralAttributeIds.has(attribute) && bleachingStatus !== BLEACHING_STATUS_NORMAL,
  ).length

/** Clears every observation's status, for a sample unit that does not include bleaching. */
export const clearBleachingStatuses = <T extends ObservationWithBleachingStatus>(
  observations: T[],
) =>
  observations.map((observation) =>
    (observation.bleaching_status ?? null) === null
      ? observation
      : { ...observation, bleaching_status: null },
  )
