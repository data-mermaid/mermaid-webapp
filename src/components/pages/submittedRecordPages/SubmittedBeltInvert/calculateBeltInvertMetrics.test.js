import { calculateBeltInvertMetrics } from './calculateBeltInvertMetrics'

const makeObs = (id, count, include = true) => ({ id, count, include })

describe('calculateBeltInvertMetrics', () => {
  it('sums count for included observations only', () => {
    const obs = [makeObs('a', 10), makeObs('b', 5), makeObs('c', 3, false)]
    const { abundance } = calculateBeltInvertMetrics(obs, 25, 1)
    expect(abundance).toBe(15) // excludes c
  })

  it('calculates density in ind/ha', () => {
    // 15 individuals over 25m × 1m = 25 m² = 0.0025 ha → 15/0.0025 = 6000 ind/ha
    const obs = [makeObs('a', 10), makeObs('b', 5)]
    const { density } = calculateBeltInvertMetrics(obs, 25, 1)
    expect(density).toBeCloseTo(6000)
  })

  it('returns 0 density when area is 0', () => {
    const { density } = calculateBeltInvertMetrics([makeObs('a', 5)], 0, 1)
    expect(density).toBe(0)
  })

  it('per-observation density is 0 for excluded rows', () => {
    const obs = [makeObs('a', 10, false)]
    const { observationDensities } = calculateBeltInvertMetrics(obs, 25, 1)
    expect(observationDensities.get('a')).toBe(0)
  })

  it('calculates density per group of interest for included observations', () => {
    const obs = [
      { ...makeObs('a', 10), invert_attribute: 'attr-1' },
      { ...makeObs('b', 5), invert_attribute: 'attr-2' },
      { ...makeObs('c', 5), invert_attribute: 'attr-3' },
      { ...makeObs('d', 5, false), invert_attribute: 'attr-2' },
    ]
    const invertAttributes = [
      { id: 'attr-1', group_of_interest: 'goi-1' },
      { id: 'attr-2', group_of_interest: 'goi-1' },
      { id: 'attr-3', group_of_interest: 'goi-2' },
    ]

    const { densityPerGroupOfInterest } = calculateBeltInvertMetrics(obs, 25, 1, invertAttributes)

    expect(densityPerGroupOfInterest.get('goi-1')).toBeCloseTo(6000)
    expect(densityPerGroupOfInterest.get('goi-2')).toBeCloseTo(2000)
  })
})
