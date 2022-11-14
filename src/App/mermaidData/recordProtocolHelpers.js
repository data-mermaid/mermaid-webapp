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
