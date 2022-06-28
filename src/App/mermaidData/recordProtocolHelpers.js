export const getRecordSampleUnitMethod = (protocol) => {
  return {
    fishbelt: 'Fish Belt',
    benthiclit: 'Benthic LIT',
    benthicpit: 'Benthic PIT',
    habitatcomplexity: 'Habitat Complexity',
    bleachingqc: 'Bleaching',
    benthicpqt: 'Benthic Photo Quadrat',
  }[protocol]
}

export const getRecordSampleUnit = (protocol) => {
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
