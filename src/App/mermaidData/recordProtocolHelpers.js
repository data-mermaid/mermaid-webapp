export const getProtocolTransectType = (protocol) => {
  return {
    fishbelt: 'fishbelt_transect',
    benthiclit: 'benthic_transect',
    benthicpit: 'benthic_transect',
    habitatcomplexity: 'benthic_transect',
    bleachingqc: 'quadrat_collection',
    benthicpqt: 'quadrat_transect',
  }[protocol]
}

export const getIsFishBelt = (protocol) => {
  return protocol === 'fishbelt'
}

export const getIsQuadratSampleUnit = (protocol) => {
  return protocol === 'benthicpqt' || protocol === 'bleachingqc'
}

export const noLabelSymbol = '-'

export const getObservationsPropertyNames = (collectRecord) => {
  return (
    {
      fishbelt: ['obs_belt_fishes'],
      benthicpit: ['obs_benthic_pits'],
      benthiclit: ['obs_benthic_lits'],
      habitatcomplexity: ['obs_habitat_complexities'],
      benthicpqt: ['obs_benthic_photo_quadrats'],
      bleachingqc: ['obs_colonies_bleached', 'obs_quadrat_benthic_percent'],
    }[collectRecord?.data?.protocol] ?? []
  )
}

export const getProtocolMethodsType = (protocol) => {
  return {
    fishbelt: 'beltfishtransectmethods',
    benthiclit: 'benthiclittransectmethods',
    benthicpit: 'benthicpittransectmethods',
    habitatcomplexity: 'habitatcomplexitytransectmethods',
    bleachingqc: 'bleachingquadratcollectionmethods',
    benthicpqt: 'benthicphotoquadrattransectmethods',
  }[protocol]
}
