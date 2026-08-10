import { describe, expect, it } from 'vitest'
import { calculateDensityByGroupOfInterest } from './calculateGroupOfInterestDensity'

// Shared taxonomy for tests:
//   class C1 → order O1 → family F1 → genus G1 (GoI: corallivore), G2 (GoI: corallivore), G3 (GoI: other)
//   class C1 → order O1 → family F2 → genus G4 (GoI: corallivore)
const corallivore = { id: 'goi-corallivore', name: 'Corallivore', taxonomic_rank: 'goi' as const }
const other = { id: 'goi-other', name: 'Other', taxonomic_rank: 'goi' as const }

const family1 = { id: 'family-1', taxonomic_rank: 'family', parent: 'order-1' }
const family2 = { id: 'family-2', taxonomic_rank: 'family', parent: 'order-1' }
const order1 = { id: 'order-1', taxonomic_rank: 'order', parent: 'class-1' }
const class1 = { id: 'class-1', taxonomic_rank: 'class', parent: null }

// F1: 2 corallivore genera + 1 other genus → 2 distinct GoIs
const genusG1 = { id: 'genus-1', taxonomic_rank: 'genus', parent: 'family-1', group_of_interest: 'goi-corallivore' }
const genusG2 = { id: 'genus-2', taxonomic_rank: 'genus', parent: 'family-1', group_of_interest: 'goi-corallivore' }
const genusG3 = { id: 'genus-3', taxonomic_rank: 'genus', parent: 'family-1', group_of_interest: 'goi-other' }

// F2: 1 corallivore genus → 1 distinct GoI
const genusG4 = { id: 'genus-4', taxonomic_rank: 'genus', parent: 'family-2', group_of_interest: 'goi-corallivore' }

const allAttributes = [corallivore, other, family1, family2, order1, class1, genusG1, genusG2, genusG3, genusG4]

const goiChoices = [corallivore, other]

// area = 25m * 2m = 50 m²; density formula: (count / 50) * 10000
const LEN = 25
const WIDTH = 2

describe('calculateDensityByGroupOfInterest', () => {
  describe('genus/species observations', () => {
    it('attributes a genus observation directly to its GoI', () => {
      const obs = [{ count: 10, invert_attribute: 'genus-1' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      // 10 / 50 * 10000 = 2000 ind/ha
      expect(densityByGoi['Corallivore']).toBe(2000)
      expect(densityByGoi['Other']).toBeUndefined()
    })
  })

  describe('family-level observations — equal-split weighting', () => {
    it('splits equally when both GoIs appear (2 corallivore genera, 1 other genus = 2 distinct GoIs → 0.5 each)', () => {
      const obs = [{ count: 400, invert_attribute: 'family-1' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      // equal-split: weight = 0.5 each
      // corallivore: (400 * 0.5) / 50 * 10000 = 40000 ind/ha
      // other:       (400 * 0.5) / 50 * 10000 = 40000 ind/ha
      expect(densityByGoi['Corallivore']).toBe(40000)
      expect(densityByGoi['Other']).toBe(40000)
    })

    it('returns the full count when a family has only one distinct GoI', () => {
      const obs = [{ count: 100, invert_attribute: 'family-2' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      // only corallivore → weight = 1.0
      // (100 * 1.0) / 50 * 10000 = 20000 ind/ha
      expect(densityByGoi['Corallivore']).toBe(20000)
      expect(densityByGoi['Other']).toBeUndefined()
    })
  })

  describe('order-level observations — equal-split weighting', () => {
    it('aggregates distinct GoIs across all families in the order', () => {
      // O1 has F1 (corallivore + other) and F2 (corallivore) → 2 distinct GoIs → 0.5 each
      const obs = [{ count: 200, invert_attribute: 'order-1' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      expect(densityByGoi['Corallivore']).toBe(20000)
      expect(densityByGoi['Other']).toBe(20000)
    })
  })

  describe('class-level observations — equal-split weighting', () => {
    it('aggregates distinct GoIs across all orders in the class', () => {
      const obs = [{ count: 200, invert_attribute: 'class-1' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      expect(densityByGoi['Corallivore']).toBe(20000)
      expect(densityByGoi['Other']).toBe(20000)
    })
  })

  describe('goi-level observations', () => {
    it('attributes a goi observation directly to itself', () => {
      const obs = [{ count: 50, invert_attribute: 'goi-corallivore' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      expect(densityByGoi['Corallivore']).toBe(10000)
      expect(densityByGoi['Other']).toBeUndefined()
    })
  })

  describe('totalDensity', () => {
    it('is the sum of all observation counts regardless of GoI', () => {
      const obs = [
        { count: 100, invert_attribute: 'family-1' },
        { count: 50, invert_attribute: 'genus-4' },
      ]
      const { totalDensity } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      // (100 + 50) / 50 * 10000 = 30000
      expect(totalDensity).toBe(30000)
    })
  })

  describe('ghost-zero filter', () => {
    it('skips zero-count observations', () => {
      const obs = [{ count: 0, invert_attribute: 'family-1' }]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, LEN, WIDTH, { goiChoices })

      expect(Object.keys(densityByGoi)).toHaveLength(0)
    })

    it('omits GoIs whose density rounds to 0.00 and keeps those above', () => {
      // area = 2001 * 1000 = 2,001,000 m²
      // genus-1 (Corallivore): (1 / 2001000) * 10000 ≈ 0.0050 → rounds to 0.00 → excluded
      // genus-3 (Other):       (2 / 2001000) * 10000 ≈ 0.0100 → rounds to 0.01 → included
      const obs = [
        { count: 1, invert_attribute: 'genus-1' },
        { count: 2, invert_attribute: 'genus-3' },
      ]
      const { densityByGoi } = calculateDensityByGroupOfInterest(obs, allAttributes, 2001, 1000, { goiChoices })

      expect(densityByGoi['Corallivore']).toBeUndefined()
      expect(densityByGoi['Other']).toBe(0.01)
    })
  })
})
