import { useMemo } from 'react'
import { calculateDensityByGroupOfInterest } from './calculateGroupOfInterestDensity'

interface BeltInvertObservation {
  id: string
  count?: number | null
  include?: boolean
  invert_attribute?: string | null
}

interface InvertAttribute {
  id: string
  name?: string
  display_name?: string
  parent?: string | null
  taxonomic_rank?: string | null
  group_of_interest?: string | null
}

interface WidthChoice {
  id: string | number
  val?: number | string
}

interface ChoicesWithBeltInvertWidths {
  invertbelttransectwidths?: { data?: WidthChoice[] }
  belttransectwidths?: { data?: WidthChoice[] }
  invertgroupsofinterest?: {
    data?: { id: string | number; name: string }[]
  }
}

interface UseBeltInvertDensityMetricsArgs {
  observations: BeltInvertObservation[]
  invertAttributes: InvertAttribute[]
  choices?: ChoicesWithBeltInvertWidths
  lenSurveyed: number | string
  widthId?: number | string
}

interface UseBeltInvertDensityMetricsResult {
  transectWidth: number
  transectAreaM2: number
  abundance: number
  observationDensities: Map<string, number>
  totalDensity: number
  densityByGoi: Record<string, number>
}

interface BeltInvertObservationMetrics {
  abundance: number
  observationDensities: Map<string, number>
}

const calculateBeltInvertObservationMetrics = (
  observations: BeltInvertObservation[],
  lenSurveyed: number | string,
  width: number | string,
): BeltInvertObservationMetrics => {
  const includedObservations = observations.filter((observation) => observation.include !== false)

  const abundance = includedObservations.reduce(
    (sum, observation) => sum + Number(observation.count ?? 0),
    0,
  )

  const areaM2 = Number(lenSurveyed) * Number(width)
  const observationDensities = new Map<string, number>(
    observations.map((observation) => {
      if (observation.include === false) {
        return [observation.id, 0]
      }

      const observationDensity = areaM2 > 0 ? (Number(observation.count ?? 0) / areaM2) * 10000 : 0
      return [observation.id, observationDensity]
    }),
  )

  return { abundance, observationDensities }
}

const beltInvertTransectWidth = (
  choices: ChoicesWithBeltInvertWidths | undefined,
  widthId: number | string | undefined,
): number => {
  const widthChoices =
    choices?.invertbelttransectwidths?.data ?? choices?.belttransectwidths?.data ?? []
  const selectedWidth = widthChoices.find((option) => `${option.id}` === `${widthId}`)
  const widthFromChoice = Number(selectedWidth?.val)
  const widthFromIdentifier = Number(widthId)

  if (Number.isFinite(widthFromChoice)) {
    return widthFromChoice
  }

  return Number.isFinite(widthFromIdentifier) ? widthFromIdentifier : 0
}

export const useBeltInvertDensityMetrics = ({
  observations,
  invertAttributes,
  choices,
  lenSurveyed,
  widthId,
}: UseBeltInvertDensityMetricsArgs): UseBeltInvertDensityMetricsResult => {
  const transectWidth = beltInvertTransectWidth(choices, widthId)

  const lenSurveyedNumber = Number(lenSurveyed)
  const transectAreaM2 =
    Number.isFinite(lenSurveyedNumber) && Number.isFinite(transectWidth)
      ? lenSurveyedNumber * transectWidth
      : 0

  const { abundance, observationDensities } = useMemo(() => {
    return calculateBeltInvertObservationMetrics(observations, lenSurveyed, transectWidth)
  }, [observations, lenSurveyed, transectWidth])

  const { totalDensity, densityByGoi } = useMemo(() => {
    return calculateDensityByGroupOfInterest(
      observations,
      invertAttributes,
      Number(lenSurveyed),
      transectWidth,
      {
        choices,
      },
    )
  }, [observations, invertAttributes, lenSurveyed, transectWidth, choices])

  return {
    transectWidth,
    transectAreaM2,
    abundance,
    observationDensities,
    totalDensity,
    densityByGoi,
  }
}
