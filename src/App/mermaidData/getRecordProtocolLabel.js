export const getRecordProtocolLabel = (protocol) => {
  return {
    fishbelt: 'Fish Belt',
    benthiclit: 'Benthic LIT',
    benthicpit: 'Benthic PIT',
    habitatcomplexity: 'Habitat Complexity',
    bleachingqc: 'Bleaching',
    benthicpqt: 'Benthic Photo Quadrat',
  }[protocol]
}
