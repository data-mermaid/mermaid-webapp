import React from 'react'
import { describe, expect, test } from 'vitest'

import { renderUnauthenticatedOffline, screen } from '../../testUtilities/testingLibraryWithHelpers'
import BleachingColoniesBleachedSummaryStats from './BleachingColoniesBleachedSummaryStats'

// The test setup's t() returns the key, so each row is found by its heading's key.
const getStat = (key) => screen.getByText(key).closest('tr').querySelector('td').textContent

const row = (overrides) => ({
  id: crypto.randomUUID(),
  attribute: 'genus-a',
  count_normal: 0,
  count_pale: 0,
  count_20: 0,
  count_50: 0,
  count_80: 0,
  count_100: 0,
  count_dead: 0,
  ...overrides,
})

describe('BleachingColoniesBleachedSummaryStats', () => {
  test('treats a count a row leaves out as zero', () => {
    renderUnauthenticatedOffline(
      <BleachingColoniesBleachedSummaryStats
        observationsColoniesBleached={[
          { id: 'partial', attribute: 'genus-a', count_normal: 3 },
          row({ count_pale: 1 }),
        ]}
      />,
    )

    expect(getStat('observations.total_colonies')).toBe('4')
    expect(getStat('observations.percent_normal_colonies')).toBe('75.0')
    expect(getStat('observations.percent_pale_colonies')).toBe('25.0')
    expect(getStat('observations.percent_bleached_colonies')).toBe('0.0')
  })

  test('counts each genus once, however many rows it has', () => {
    renderUnauthenticatedOffline(
      <BleachingColoniesBleachedSummaryStats
        observationsColoniesBleached={[
          row({ attribute: 'genus-a', count_normal: 1 }),
          row({ attribute: 'genus-a', count_pale: 2 }),
          row({ attribute: 'genus-b', count_normal: 1 }),
          row({ attribute: '' }),
        ]}
      />,
    )

    expect(getStat('observations.total_coral_genera')).toBe('2')
  })
})
