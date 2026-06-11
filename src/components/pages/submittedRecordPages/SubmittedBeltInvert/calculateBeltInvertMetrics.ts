interface BeltInvertObservation {
  id: string
  count?: number | null
  include?: boolean
  invert_attribute?: string | null
}

interface InvertAttributeLookup {
  id: string
  group_of_interest?: string | null
}

interface BeltInvertMetrics {
  abundance: number
  density: number
  observationDensities: Map<string, number>
  densityPerGroupOfInterest: Map<string | null, number>
}

export const calculateBeltInvertMetrics = (
  observations: BeltInvertObservation[],
  lenSurveyed: number | string,
  width: number | string,
  invertAttributes: InvertAttributeLookup[] = [],
): BeltInvertMetrics => {
  const includedObs = observations.filter((obs) => obs.include !== false)

  const abundance = includedObs.reduce((sum, obs) => sum + Number(obs.count ?? 0), 0)

  const areaM2 = Number(lenSurveyed) * Number(width)
  // Convert m^2 to ha: 1 ha = 10,000 m^2
  const density = areaM2 > 0 ? (abundance / areaM2) * 10000 : 0

  // Per-observation density (ind/ha) for the observation table column
  const observationDensities = new Map<string, number>(
    observations.map((obs) => {
      if (obs.include === false) {
        return [obs.id, 0]
      }

      const obsDensity = areaM2 > 0 ? (Number(obs.count ?? 0) / areaM2) * 10000 : 0
      return [obs.id, obsDensity]
    }),
  )

  const densityPerGroupOfInterest = includedObs.reduce((groups, obs) => {
    const attribute = invertAttributes.find((invert) => invert.id === obs.invert_attribute)
    const groupId = attribute?.group_of_interest ?? null
    const obsDensity = areaM2 > 0 ? (Number(obs.count ?? 0) / areaM2) * 10000 : 0
    groups.set(groupId, (groups.get(groupId) ?? 0) + obsDensity)
    return groups
  }, new Map<string | null, number>())

  return { abundance, density, observationDensities, densityPerGroupOfInterest }
}
