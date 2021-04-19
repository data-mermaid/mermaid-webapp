export const getProtocolName = (protocol) => {
  switch (protocol) {
    case 'fishbelt':
      return 'Fish Belt'
    case 'benthiclit':
      return 'Benthic Lit'
    case 'benthicpit':
      return 'Benthic Pit'
    case 'habitatcomplexity':
      return 'Habitat Complexity'
    case 'bleaching':
      return 'Bleaching'
    default:
      return ''
  }
}
