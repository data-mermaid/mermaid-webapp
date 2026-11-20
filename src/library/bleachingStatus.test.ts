import { describe, expect, it } from 'vitest'
import {
  BLEACHING_STATUS_NORMAL,
  clearBleachingStatuses,
  countStatusesLostOnTurnOff,
  fillBleachingStatuses,
  getBleachingStatusAfterAttributeChange,
  getBleachedStatusPercents,
  getCoralAttributeIdsByType,
  parseBleachingStatusValue,
} from './bleachingStatus'

const options = [
  { value: 'hard-coral', label: 'Hard coral', topLevelCategory: 'hard-coral' },
  { value: 'acropora', label: 'Acropora', topLevelCategory: 'hard-coral' },
  { value: 'soft-coral', label: 'Soft coral', topLevelCategory: 'soft-coral' },
  { value: 'sand', label: 'Sand', topLevelCategory: 'bare-substrate' },
  { value: 'bare-substrate', label: 'Bare substrate', topLevelCategory: 'bare-substrate' },
]

const coralAttributeIds = new Set(['hard-coral', 'acropora', 'soft-coral'])

describe('getCoralAttributeIdsByType', () => {
  it('splits the coral categories and the attributes under them by coral type', () => {
    const { hardCoral, softCoral } = getCoralAttributeIdsByType(options)

    expect([...hardCoral].sort()).toEqual(['acropora', 'hard-coral'])
    expect([...softCoral]).toEqual(['soft-coral'])
  })
})

describe('fillBleachingStatuses', () => {
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
})

describe('clearBleachingStatuses', () => {
  it('clears every status and leaves observations without one alone', () => {
    expect(
      clearBleachingStatuses([
        { id: '1', attribute: 'acropora', bleaching_status: 1 },
        { id: '2', attribute: 'sand' },
      ]),
    ).toEqual([
      { id: '1', attribute: 'acropora', bleaching_status: null },
      { id: '2', attribute: 'sand' },
    ])
  })
})

describe('parseBleachingStatusValue', () => {
  it('reads NA as no status, not as Normal', () => {
    expect(parseBleachingStatusValue('')).toBeNull()
  })

  it('reads a status as its id', () => {
    expect(parseBleachingStatusValue('0')).toBe(BLEACHING_STATUS_NORMAL)
    expect(parseBleachingStatusValue('1')).toBe(1)
  })
})

describe('getBleachingStatusAfterAttributeChange', () => {
  it('drops the status when the new attribute is not coral', () => {
    expect(
      getBleachingStatusAfterAttributeChange(
        { attribute: 'acropora', bleaching_status: 2 },
        'sand',
        coralAttributeIds,
      ),
    ).toBeNull()
  })

  it('gives Normal to an observation that becomes coral', () => {
    expect(
      getBleachingStatusAfterAttributeChange({ attribute: 'sand' }, 'acropora', coralAttributeIds),
    ).toBe(BLEACHING_STATUS_NORMAL)
    expect(
      getBleachingStatusAfterAttributeChange({ attribute: '' }, 'acropora', coralAttributeIds),
    ).toBe(BLEACHING_STATUS_NORMAL)
  })

  it('keeps the status, NA included, between two coral attributes', () => {
    expect(
      getBleachingStatusAfterAttributeChange(
        { attribute: 'acropora', bleaching_status: 3 },
        'hard-coral',
        coralAttributeIds,
      ),
    ).toBe(3)
    expect(
      getBleachingStatusAfterAttributeChange(
        { attribute: 'acropora', bleaching_status: null },
        'hard-coral',
        coralAttributeIds,
      ),
    ).toBeNull()
  })
})

describe('countStatusesLostOnTurnOff', () => {
  it('counts coral statuses other than Normal, NA included', () => {
    expect(
      countStatusesLostOnTurnOff(
        [
          { attribute: 'acropora', bleaching_status: BLEACHING_STATUS_NORMAL },
          { attribute: 'acropora', bleaching_status: 1 },
          { attribute: 'acropora', bleaching_status: 4 },
          { attribute: 'acropora', bleaching_status: null },
          { attribute: 'sand' },
        ],
        new Set(['acropora']),
      ),
    ).toBe(3)
  })
})

describe('getBleachedStatusPercents', () => {
  const hardCoral = new Set(['acropora'])
  const getPercents = (observations, recordType: 'pit' | 'lit') =>
    getBleachedStatusPercents(observations, hardCoral, recordType).map(({ percent }) => percent)

  it.each([
    [
      'PIT counts observations, with Normal in the base and NA and other coral types left out',
      'pit',
      [
        { attribute: 'acropora', bleaching_status: BLEACHING_STATUS_NORMAL },
        { attribute: 'acropora', bleaching_status: 1 },
        { attribute: 'acropora', bleaching_status: 1 },
        { attribute: 'acropora', bleaching_status: 4 },
        { attribute: 'acropora', bleaching_status: null },
        { attribute: 'soft-coral', bleaching_status: 3 },
      ],
      ['50.0', '0.0', '0.0', '25.0'],
    ],
    [
      'LIT weights observations by length',
      'lit',
      [
        { attribute: 'acropora', bleaching_status: BLEACHING_STATUS_NORMAL, length: 30 },
        { attribute: 'acropora', bleaching_status: 2, length: 10 },
      ],
      ['0.0', '25.0', '0.0', '0.0'],
    ],
    [
      'a coral type with no status recorded reads 0.0',
      'pit',
      [{ attribute: 'acropora', bleaching_status: null }],
      ['0.0', '0.0', '0.0', '0.0'],
    ],
  ] as const)('%s', (_, recordType, observations, expectedPercents) => {
    expect(getPercents(observations, recordType)).toEqual(expectedPercents)
  })
})
