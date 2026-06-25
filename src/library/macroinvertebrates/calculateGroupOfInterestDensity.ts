interface InvertAttribute {
  id: string
  name?: string
  display_name?: string
  parent?: string | null
  taxonomic_rank?: string | null
  group_of_interest?: string | null
}

interface Observation {
  count?: number | null
  invert_attribute?: string | null
}

interface GoiChoice {
  id: string
  name: string
}

interface GoiChoiceInput {
  id: string | number
  name: string
}

interface ChoicesWithGoi {
  invertgroupsofinterest?: {
    data?: GoiChoiceInput[]
  }
}

type RankWithWeights = 'family' | 'order' | 'class'
type GoiWeights = Map<string, number>

interface GoiWeightMaps {
  family: Map<string, GoiWeights>
  order: Map<string, GoiWeights>
  class: Map<string, GoiWeights>
}

interface GoiDensityResult {
  totalDensity: number
  densityByGoi: Record<string, number>
}

interface GoiDensityOptions {
  choices?: ChoicesWithGoi
  goiChoices?: GoiChoice[]
  goiWeightMaps?: GoiWeightMaps
}

/**
 * Attribution model (mirrors SQL beltinvert CTEs):
 *
 * - Genus, species, and GoI-level observations map directly to a Group of Interest (GoI).
 *   - genus/species use attribute.group_of_interest if present.
 *   - goi-level uses attribute.id directly.
 * - Family, order, and class observations are split proportionally across descendant genera GoIs.
 *   - Weight for GoI = (genera count for GoI) / (total genera WITH a GoI at that rank).
 *   - Only tagged genera (those with group_of_interest) count toward the denominator,
 *     so weights always sum to 1 and no attribution is silently lost.
 * - Density formula: (count / area_m2) * 10000
 *   where area_m2 = lenSurveyed * widthM, and 10000 converts m² to ha.
 *
 * GoIs that round to 0.00 ind/ha are excluded from densityByGoi, matching the API's
 * FILTER (WHERE ROUND(density_avg::numeric, 2) > 0) ghost-zero fix.
 */

// Rounds to 2 decimal places without producing a formatted string (avoids floating-point precision noise).
const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100

// Adds a count into the running per-GoI totals map.
const addCountToGoiTotals = (goiCountTotals: Map<string, number>, goiId: string, count: number) => {
  goiCountTotals.set(goiId, (goiCountTotals.get(goiId) ?? 0) + count)
}

/**
 * Resolve the ordered list of GoIs to display.
 * Prefers the canonical API-provided list (choices.invertgroupsofinterest.data).
 * Falls back to extracting GoI-rank records from invertAttributes directly,
 * which covers environments where that choice key hasn't propagated yet.
 */
const getGoiChoices = (
  choices: ChoicesWithGoi | undefined,
  invertAttributes: InvertAttribute[],
): GoiChoice[] => {
  const apiChoices = choices?.invertgroupsofinterest?.data ?? []

  if (apiChoices.length > 0) {
    return apiChoices.map((goi) => ({
      id: String(goi.id),
      name: goi.name,
    }))
  }

  const derivedChoices = invertAttributes
    .filter((attribute) => attribute.taxonomic_rank === 'goi')
    .map((attribute) => ({
      id: attribute.id,
      name: attribute.display_name ?? attribute.name ?? attribute.id,
    }))

  return Array.from(new Map(derivedChoices.map((goi) => [goi.id, goi])).values())
}

/**
 * Compute GoI weights from a list of genera.
 * Only genera with group_of_interest contribute to the denominator,
 * so weights always sum to 1 and no attribution is silently lost.
 */
const buildWeightsFromGenera = (genera: InvertAttribute[]): GoiWeights => {
  const taggedGenera = genera.filter((genus) => genus.group_of_interest)

  if (taggedGenera.length === 0) {
    return new Map()
  }

  const countsByGoi = new Map<string, number>()

  taggedGenera.forEach((genus) => {
    const goiId = genus.group_of_interest!
    countsByGoi.set(goiId, (countsByGoi.get(goiId) ?? 0) + 1)
  })

  return new Map(
    Array.from(countsByGoi.entries()).map(([goiId, count]) => [goiId, count / taggedGenera.length]),
  )
}

/** Build genus index: familyId → genera[] */
const buildGenusIndex = (invertAttributes: InvertAttribute[]) => {
  const generaByFamilyId = new Map<string, InvertAttribute[]>()

  invertAttributes
    .filter((attribute) => attribute.taxonomic_rank === 'genus')
    .forEach((genus) => {
      if (!genus.parent) {
        return
      }
      const genera = generaByFamilyId.get(genus.parent) ?? []
      genera.push(genus)
      generaByFamilyId.set(genus.parent, genera)
    })

  return generaByFamilyId
}

/** Build family index: orderId → Set<familyId> */
const buildFamilyIndex = (invertAttributes: InvertAttribute[]) => {
  const familiesByOrderId = new Map<string, Set<string>>()

  invertAttributes
    .filter((attribute) => attribute.taxonomic_rank === 'family')
    .forEach((family) => {
      if (!family.parent) {
        return
      }
      const familyIds = familiesByOrderId.get(family.parent) ?? new Set<string>()
      familyIds.add(family.id)
      familiesByOrderId.set(family.parent, familyIds)
    })

  return familiesByOrderId
}

/** Build order index: classId → Set<orderId> */
const buildOrderIndex = (invertAttributes: InvertAttribute[]) => {
  const ordersByClassId = new Map<string, Set<string>>()

  invertAttributes
    .filter((attribute) => attribute.taxonomic_rank === 'order')
    .forEach((order) => {
      if (!order.parent) {
        return
      }
      const orderIds = ordersByClassId.get(order.parent) ?? new Set<string>()
      orderIds.add(order.id)
      ordersByClassId.set(order.parent, orderIds)
    })

  return ordersByClassId
}

/** Flatten all genera for a set of family IDs. */
const getGeneraForFamilies = (
  familyIds: Iterable<string>,
  generaByFamilyId: Map<string, InvertAttribute[]>,
): InvertAttribute[] => Array.from(familyIds).flatMap((id) => generaByFamilyId.get(id) ?? [])

/** Union all family IDs for a set of order IDs. */
const getFamilyIdsForOrders = (
  orderIds: Iterable<string>,
  familiesByOrderId: Map<string, Set<string>>,
): Set<string> => {
  const familyIds = new Set<string>()
  Array.from(orderIds).forEach((orderId) => {
    familiesByOrderId.get(orderId)?.forEach((familyId) => familyIds.add(familyId))
  })
  return familyIds
}

/**
 * Pre-compute GoI weight maps for all family, order, and class records.
 * Mirrors the SQL goi_weights_by_family/order/class CTEs.
 * Separating this from the per-observation loop means the taxonomy traversal happens once
 * per invertAttributes reference change rather than once per observation.
 */
const buildGoiWeightMaps = (invertAttributes: InvertAttribute[]): GoiWeightMaps => {
  const generaByFamilyId = buildGenusIndex(invertAttributes)
  const familiesByOrderId = buildFamilyIndex(invertAttributes)
  const ordersByClassId = buildOrderIndex(invertAttributes)

  const weightMaps: GoiWeightMaps = {
    family: new Map(),
    order: new Map(),
    class: new Map(),
  }

  // Family weights: direct from its genera
  generaByFamilyId.forEach((genera, familyId) => {
    weightMaps.family.set(familyId, buildWeightsFromGenera(genera))
  })

  // Order weights: from all genera in its families
  familiesByOrderId.forEach((familyIds, orderId) => {
    weightMaps.order.set(
      orderId,
      buildWeightsFromGenera(getGeneraForFamilies(familyIds, generaByFamilyId)),
    )
  })

  // Class weights: from all genera in its orders' families
  ordersByClassId.forEach((orderIds, classId) => {
    const familyIds = getFamilyIdsForOrders(orderIds, familiesByOrderId)
    weightMaps.class.set(
      classId,
      buildWeightsFromGenera(getGeneraForFamilies(familyIds, generaByFamilyId)),
    )
  })

  return weightMaps
}

/**
 * Attribute a single observation's count to one or more GoIs.
 * - goi/genus/species: direct attribution
 * - family/order/class: proportional split via pre-computed weight maps
 * - unknown rank with group_of_interest: direct fallback
 */
const attributeObservationToGoi = (
  attribute: InvertAttribute,
  count: number,
  goiWeightMaps: GoiWeightMaps,
  goiCountTotals: Map<string, number>,
) => {
  const rank = attribute.taxonomic_rank

  if (rank === 'goi') {
    addCountToGoiTotals(goiCountTotals, attribute.id, count)
    return
  }

  if (rank === 'genus' || rank === 'species') {
    if (attribute.group_of_interest) {
      addCountToGoiTotals(goiCountTotals, attribute.group_of_interest, count)
    }
    return
  }

  if (rank === 'family' || rank === 'order' || rank === 'class') {
    goiWeightMaps[rank as RankWithWeights].get(attribute.id)?.forEach((weight, goiId) => {
      addCountToGoiTotals(goiCountTotals, goiId, count * weight)
    })
    return
  }

  // Fallback: unknown rank with a group_of_interest — attribute directly
  if (attribute.group_of_interest) {
    addCountToGoiTotals(goiCountTotals, attribute.group_of_interest, count)
  }
}

/** Convert per-GoI count totals to ind/ha densities, omitting GoIs that round to 0.00. */
const buildDensityByGoi = (
  goiCountTotals: Map<string, number>,
  goiChoices: GoiChoice[],
  areaM2: number,
): Record<string, number> =>
  goiChoices.reduce((result, goi) => {
    const density = areaM2 > 0 ? ((goiCountTotals.get(goi.id) ?? 0) / areaM2) * 10000 : 0
    const rounded = roundToTwoDecimals(density)
    if (rounded > 0) {
      result[goi.name] = rounded
    }
    return result
  }, {} as Record<string, number>)

export const calculateDensityByGroupOfInterest = (
  observations: Observation[],
  invertAttributes: InvertAttribute[],
  lenSurveyed: number,
  widthM: number,
  options: GoiDensityOptions = {},
): GoiDensityResult => {
  const goiChoices = options.goiChoices ?? getGoiChoices(options.choices, invertAttributes)
  const goiWeightMaps = options.goiWeightMaps ?? buildGoiWeightMaps(invertAttributes)
  const attributeById = new Map(invertAttributes.map((attribute) => [attribute.id, attribute]))

  // Accumulate per-GoI count totals from observations
  const totalObservationCount = observations.reduce(
    (sum, observation) => sum + Number(observation.count ?? 0),
    0,
  )

  const goiCountTotals = new Map<string, number>()

  observations.forEach((observation) => {
    const count = Number(observation.count ?? 0)
    if (!Number.isFinite(count) || count <= 0) {
      return
    }

    const attributeId = observation.invert_attribute
    if (!attributeId) {
      return
    }

    const attribute = attributeById.get(attributeId)
    if (!attribute) {
      return
    }

    attributeObservationToGoi(attribute, count, goiWeightMaps, goiCountTotals)
  })

  // Density conversion — (count / area_m2) * 10000 to get ind/ha
  const areaM2 = Number(lenSurveyed) * Number(widthM)
  const totalDensity = areaM2 > 0 ? roundToTwoDecimals((totalObservationCount / areaM2) * 10000) : 0
  const densityByGoi = buildDensityByGoi(goiCountTotals, goiChoices, areaM2)

  return { totalDensity, densityByGoi }
}
