import { describe, expect, it } from 'vitest'
import {
  BLEACHING_STATUS_NORMAL,
  clearBleachingStatuses,
  fillBleachingStatuses,
  getCoralAttributeIds,
} from './bleachingStatus'

const options = [
  { value: 'hard-coral', label: 'Hard coral', topLevelCategory: 'hard-coral' },
  { value: 'acropora', label: 'Acropora', topLevelCategory: 'hard-coral' },
  { value: 'soft-coral', label: 'Soft coral', topLevelCategory: 'soft-coral' },
  { value: 'sand', label: 'Sand', topLevelCategory: 'bare-substrate' },
  { value: 'bare-substrate', label: 'Bare substrate', topLevelCategory: 'bare-substrate' },
]

describe('getCoralAttributeIds', () => {
  it('includes the Hard coral and Soft coral categories and the attributes under them', () => {
    expect([...getCoralAttributeIds(options)].sort()).toEqual([
      'acropora',
      'hard-coral',
      'soft-coral',
    ])
  })
})

describe('fillBleachingStatuses', () => {
  const coralAttributeIds = getCoralAttributeIds(options)

  it('gives coral observations with no status Normal and leaves everything else alone', () => {
    const observations = [
      { id: '1', attribute: 'acropora' },
      { id: '2', attribute: 'acropora', bleaching_status: 3 },
      { id: '3', attribute: 'sand', bleaching_status: null },
      { id: '4', attribute: '' },
    ]

    expect(fillBleachingStatuses(observations, coralAttributeIds)).toEqual([
      { id: '1', attribute: 'acropora', bleaching_status: BLEACHING_STATUS_NORMAL },
      { id: '2', attribute: 'acropora', bleaching_status: 3 },
      { id: '3', attribute: 'sand', bleaching_status: null },
      { id: '4', attribute: '' },
    ])
  })

  it('returns the same array when every coral observation already has a status', () => {
    const observations = [
      { id: '1', attribute: 'acropora', bleaching_status: 1 },
      { id: '2', attribute: 'sand' },
    ]

    expect(fillBleachingStatuses(observations, coralAttributeIds)).toBe(observations)
    expect(fillBleachingStatuses(observations, new Set())).toBe(observations)
  })
})

describe('clearBleachingStatuses', () => {
  it('clears every status and returns the same array when there is none', () => {
    expect(
      clearBleachingStatuses([
        { id: '1', attribute: 'acropora', bleaching_status: 1 },
        { id: '2', attribute: 'sand' },
      ]),
    ).toEqual([
      { id: '1', attribute: 'acropora', bleaching_status: null },
      { id: '2', attribute: 'sand' },
    ])

    const untouched = [{ id: '1', attribute: 'acropora' }]

    expect(clearBleachingStatuses(untouched)).toBe(untouched)
  })
})
