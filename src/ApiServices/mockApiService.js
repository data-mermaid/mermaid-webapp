export default {
  projects: [
    {
      name: 'Karimunjawa National Park',
      country: 'Fiji',
      numberOfSites: 23,
      offlineReady: true,
      lastUpdatedDate: '01/21/2020',
    },
    {
      name: 'Gita Nada_MPA 2018',
      country: 'Fiji',
      numberOfSites: 1,
      offlineReady: false,
      lastUpdatedDate: '11/21/2021',
    },
  ],
  collectRecords: [
    {
      id: '1',
      method: 'Benthic LIT',
      site: '1203',
      management_regime: 'Ankivonjy no-take',
      data: { protocol: 'benthiclit' },
      depth: 20,
    },
    {
      id: '2',
      method: 'Fish Belt',
      site: 'Karang Kapal',
      management_regime: 'Fisheries Utilization',
      data: { protocol: 'fishbelt' },
      depth: 10,
    },
  ],
  sites: [
    {
      name: 'Amazing Maze',
      reef_type: 'patch',
      reef_zone: 'pinnacle',
      exposure: 'exposed',
    },
    {
      name: 'BU02',
      reef_type: 'fringing',
      reef_zone: 'back reef',
      exposure: 'sheltered',
    },
    {
      name: '1203',
      reef_type: 'patch',
      reef_zone: 'fore reef',
      exposure: 'very sheltered',
    },
    {
      name: 'Karang Kapal',
      reef_type: 'patch',
      reef_zone: 'back reef',
      exposure: 'exposed',
    },
  ],
  management_regimes: [
    { name: 'Fisheries Utilization' },
    { name: 'Ankivonjy no-take' },
    { name: 'Bureta tabu' },
  ],
}
