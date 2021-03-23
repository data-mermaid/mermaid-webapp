class MermaidDatabaseGateway {
  static getCollectRecordMethodLabel = (protocol) => {
    switch (protocol) {
      default:
        return 'Unknown Method'
      case 'fishbelt':
        return 'Fish Belt'
      case 'benthiclit':
        return 'Benthic LIT'
      case 'benthicpit':
        return 'Benthic PIT'
      case 'habitatcomplexity':
        return 'Habitat Complexity'
      case 'bleachingqc':
        return 'Bleaching'
    }
  }
}

export default MermaidDatabaseGateway
