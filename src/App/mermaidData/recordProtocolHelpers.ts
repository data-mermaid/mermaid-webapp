type Protocol =
  | 'fishbelt'
  | 'benthiclit'
  | 'benthicpit'
  | 'habitatcomplexity'
  | 'bleachingqc'
  | 'benthicpqt'
  | 'macroinvertebrate'

export const getProtocolTransectType = (protocol: Protocol): string | undefined => {
  return {
    fishbelt: 'fishbelt_transect',
    benthiclit: 'benthic_transect',
    benthicpit: 'benthic_transect',
    habitatcomplexity: 'benthic_transect',
    bleachingqc: 'quadrat_collection',
    benthicpqt: 'quadrat_transect',
    macroinvertebrate: 'beltinvert_transect', // Placeholder. May change when API is live
  }[protocol]
}

export const getIsFishBelt = (protocol: Protocol): boolean => {
  return protocol === 'fishbelt'
}

export const getIsQuadratSampleUnit = (protocol: Protocol): boolean => {
  return protocol === 'benthicpqt' || protocol === 'bleachingqc'
}

export const noLabelSymbol = '-'

export const getObservationsPropertyNames = (collectRecord: {
  data?: { protocol?: Protocol | string }
}): string[] => {
  return (
    {
      fishbelt: ['obs_belt_fishes'],
      benthicpit: ['obs_benthic_pits'],
      benthiclit: ['obs_benthic_lits'],
      habitatcomplexity: ['obs_habitat_complexities'],
      benthicpqt: ['obs_benthic_photo_quadrats'],
      bleachingqc: ['obs_colonies_bleached', 'obs_quadrat_benthic_percent'],
      macroinvertebrate: ['obs_belt_inverts'],
    }[collectRecord?.data?.protocol ?? ''] ?? []
  )
}

export const getProtocolMethodsType = (protocol: Protocol): string | undefined => {
  return {
    fishbelt: 'beltfishtransectmethods',
    benthiclit: 'benthiclittransectmethods',
    benthicpit: 'benthicpittransectmethods',
    habitatcomplexity: 'habitatcomplexitytransectmethods',
    bleachingqc: 'bleachingquadratcollectionmethods',
    benthicpqt: 'benthicphotoquadrattransectmethods',
    macroinvertebrate: 'beltinverttransectmethods', // Placeholder. May change when API is live
  }[protocol]
}
