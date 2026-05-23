type AttributeType = 'benthic_attributes' | 'fish_species'

type AttributeCounts = Record<AttributeType, Record<string, number>>

interface CollectRecordObservationData {
  obs_belt_fishes?: { fish_attribute?: string | null }[]
  obs_benthic_lits?: { attribute?: string | null }[]
  obs_benthic_pits?: { attribute?: string | null }[]
  obs_colonies_bleached?: { attribute?: string | null }[]
  obs_quadrat_benthic_percent?: { attribute?: string | null }[]
  obs_benthic_photo_quadrats?: { attribute?: string | null }[]
}

interface CollectRecord {
  data: CollectRecordObservationData
}

interface DexiePerUserDataInstance {
  collect_records: {
    toArray: () => Promise<CollectRecord[]>
  }
}

// Looks at all fish species and benthic attributes used in collect records,
// grouped by attribute type with counts per attribute ID.
const getAttributesInUse = async (
  dexiePerUserDataInstance: DexiePerUserDataInstance,
): Promise<AttributeCounts> => {
  const attributeCounts: AttributeCounts = {
    benthic_attributes: {},
    fish_species: {},
  }

  const incrementIfTruthy = (
    attributeId: string | null | undefined,
    attributeType: AttributeType,
  ) => {
    if (attributeId) {
      attributeCounts[attributeType][attributeId] =
        (attributeCounts[attributeType][attributeId] ?? 0) + 1
    }
  }

  const collectRecordsInUse = await dexiePerUserDataInstance.collect_records.toArray()
  collectRecordsInUse.forEach((record) => {
    const data = record.data

    data.obs_belt_fishes?.forEach((obs) => incrementIfTruthy(obs.fish_attribute, 'fish_species'))
    data.obs_benthic_lits?.forEach((obs) => incrementIfTruthy(obs.attribute, 'benthic_attributes'))
    data.obs_benthic_pits?.forEach((obs) => incrementIfTruthy(obs.attribute, 'benthic_attributes'))
    data.obs_colonies_bleached?.forEach((obs) =>
      incrementIfTruthy(obs.attribute, 'benthic_attributes'),
    )
    data.obs_quadrat_benthic_percent?.forEach((obs) =>
      incrementIfTruthy(obs.attribute, 'benthic_attributes'),
    )
    data.obs_benthic_photo_quadrats?.forEach((obs) =>
      incrementIfTruthy(obs.attribute, 'benthic_attributes'),
    )
  })

  return attributeCounts
}

export default getAttributesInUse
