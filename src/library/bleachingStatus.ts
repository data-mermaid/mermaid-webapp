import type { TFunction } from 'i18next'

// Bleaching on a Benthic PIT or LIT observation, on the NOAA scale. The ids match
// BLEACHING_STATUS_CHOICES in mermaid-api, which stores the integer. A null or missing
// bleaching_status means the observation was not assessed: a coral observation shows it as
// Not recorded, any other observation as NA.
export const BLEACHING_STATUS_NORMAL = 0

const BLEACHING_STATUSES = [
  { id: BLEACHING_STATUS_NORMAL, translationKey: 'bleaching_status.normal' },
  { id: 1, translationKey: 'bleaching_status.pale' },
  { id: 2, translationKey: 'bleaching_status.partially_bleached' },
  { id: 3, translationKey: 'bleaching_status.fully_bleached' },
  { id: 4, translationKey: 'bleaching_status.recent_bleaching_mortality' },
] as const

const NOT_RECORDED_OPTION_VALUE = ''

// What a coral observation's select offers: the scale, then Not recorded.
export const getBleachingStatusOptions = (t: TFunction) => [
  ...BLEACHING_STATUSES.map(({ id, translationKey }) => ({ value: id, label: t(translationKey) })),
  { value: NOT_RECORDED_OPTION_VALUE, label: t('bleaching_status.not_recorded') },
]

// Number('') is 0, which is Normal, so Not recorded has to be mapped before converting.
export const parseBleachingStatusValue = (optionValue: string) =>
  optionValue === NOT_RECORDED_OPTION_VALUE ? null : Number(optionValue)

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

// Switching bleaching on: every coral observation with no status becomes Normal. Run it only on
// that switch. A coral observation with no status afterwards is one the diver set to Not recorded.
export const fillBleachingStatuses = <T extends ObservationWithBleachingStatus>(
  observations: T[],
  coralAttributeIds: Set<string>,
) =>
  observations.map((observation) =>
    coralAttributeIds.has(observation.attribute) && (observation.bleaching_status ?? null) === null
      ? { ...observation, bleaching_status: BLEACHING_STATUS_NORMAL }
      : observation,
  )

// An observation's status once its attribute changes. A status only carries over between two
// coral attributes, so Not recorded survives that change too.
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

// Coral observations whose status switching bleaching off would lose: anything but Normal.
// Not recorded counts too, because switching back on fills every coral observation with no
// status with Normal.
export const countStatusesLostOnTurnOff = (
  observations: ObservationWithBleachingStatus[],
  coralAttributeIds: Set<string>,
) =>
  observations.filter(
    ({ attribute, bleaching_status: bleachingStatus }) =>
      coralAttributeIds.has(attribute) && bleachingStatus !== BLEACHING_STATUS_NORMAL,
  ).length

// Bleaching not included: every observation is not assessed.
export const clearBleachingStatuses = <T extends ObservationWithBleachingStatus>(
  observations: T[],
) =>
  observations.map((observation) =>
    (observation.bleaching_status ?? null) === null
      ? observation
      : { ...observation, bleaching_status: null },
  )
