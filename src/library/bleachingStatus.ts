import type { TFunction } from 'i18next'

import { roundToOneDecimal } from './numbers/roundToOneDecimal'

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

interface BenthicAttributeOption {
  value: string
  label: string
  topLevelCategory?: string
}

export interface CoralAttributeIdsByType {
  hardCoral: Set<string>
  softCoral: Set<string>
}

/**
 * Ids of the Hard coral and Soft coral categories and every attribute under each: the attributes
 * that take a bleaching status, by the same rule as the API's BleachingStatusValidator.
 */
export const getCoralAttributeIdsByType = (
  benthicAttributeOptions: BenthicAttributeOption[],
): CoralAttributeIdsByType => {
  const getIdsUnderCategory = (categoryName: string) => {
    const categoryIds = new Set(
      benthicAttributeOptions
        .filter(({ label }) => label === categoryName)
        .map(({ value }) => value),
    )

    return new Set(
      benthicAttributeOptions
        .filter(
          ({ value, topLevelCategory }) =>
            categoryIds.has(value) || categoryIds.has(topLevelCategory),
        )
        .map(({ value }) => value),
    )
  }

  return {
    hardCoral: getIdsUnderCategory('Hard coral'),
    softCoral: getIdsUnderCategory('Soft coral'),
  }
}

interface ObservationWithBleachingStatus {
  attribute?: string
  bleaching_status?: number | null
  length?: number | string
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

/** Observations that switching bleaching off would lose a bleached status from: Pale or beyond. */
export const countBleachedStatuses = (observations: ObservationWithBleachingStatus[]) =>
  observations.filter(
    ({ bleaching_status: bleachingStatus }) =>
      (bleachingStatus ?? BLEACHING_STATUS_NORMAL) !== BLEACHING_STATUS_NORMAL,
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

const BLEACHED_STATUSES = BLEACHING_STATUSES.filter(({ id }) => id !== BLEACHING_STATUS_NORMAL)

/**
 * Each bleached status's share of one coral type's observations that have a status, so NA is
 * left out. PIT counts observations; LIT weights them by length, as % cover does. Null when no
 * observation of the type has a status, since there is nothing to take a share of.
 */
export const getBleachedStatusPercents = (
  observations: ObservationWithBleachingStatus[],
  coralAttributeIds: Set<string>,
  recordType: 'pit' | 'lit',
) => {
  const getWeight = ({ length }: ObservationWithBleachingStatus) =>
    recordType === 'lit' ? Number(length) : 1
  const sumWeights = (weighedObservations: ObservationWithBleachingStatus[]) =>
    weighedObservations.reduce((total, observation) => total + getWeight(observation), 0)

  const observationsWithStatus = observations.filter(
    ({ attribute, bleaching_status: bleachingStatus }) =>
      coralAttributeIds.has(attribute) && (bleachingStatus ?? null) !== null,
  )
  if (!observationsWithStatus.length) {
    return null
  }

  const totalWeight = sumWeights(observationsWithStatus)

  return BLEACHED_STATUSES.map(({ id, translationKey }) => {
    const statusWeight = sumWeights(
      observationsWithStatus.filter(
        ({ bleaching_status: bleachingStatus }) => bleachingStatus === id,
      ),
    )

    return {
      id,
      translationKey,
      percent: roundToOneDecimal(totalWeight ? (statusWeight / totalWeight) * 100 : 0),
    }
  })
}
