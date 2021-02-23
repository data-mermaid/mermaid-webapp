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
}
