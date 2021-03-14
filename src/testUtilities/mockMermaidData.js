export default {
  projects: [
    {
      name:
        'Karimunjawa National Park is a long name for a project, not as long as Karimunjawaawajnumirak',
      country: 'Fiji',
      numberOfSites: 23,
      offlineReady: true,
      lastUpdatedDate: '01/21/2020',
    },
    {
      name: 'Gita Nada_MPA 2018',
      country: 'Indonesia',
      numberOfSites: 26,
      offlineReady: true,
      lastUpdatedDate: '11/21/2021',
    },
    {
      name:
        'Survei Ekologi KKPD Aceh Besar, KKPD Pesisir Timur Sabang dan TWAL Pulau Weh',
      country: 'Albania, Indonesia, Malaysia',
      numberOfSites: 34,
      offlineReady: false,
      lastUpdatedDate: '11/21/2021',
    },
    {
      name: "Belize Glover's Atoll 2019",
      country: 'Fiji, Indonesia',
      numberOfSites: 49,
      offlineReady: false,
      lastUpdatedDate: '11/21/2021',
    },
    {
      name: 'XPDC Kei Kecil 2018',
      country: 'Fiji',
      numberOfSites: 33,
      offlineReady: false,
      lastUpdatedDate: '11/21/2021',
    },
  ],
  collectRecords: [
    {
      id: '1',
      method: 'Benthic LIT',
      site: '3',
      management: '2',
      data: { protocol: 'benthiclit' },
      depth: 20,
    },
    {
      id: '2',
      method: 'Fish Belt',
      site: '4',
      management: '3',
      data: { protocol: 'fishbelt' },
      depth: 10,
    },
  ],
  sites: [
    {
      id: '1',
      name: 'Amazing Maze',
      reef_type: 'patch',
      reef_zone: 'pinnacle',
      exposure: 'exposed',
    },
    {
      id: '2',
      name: 'BU02',
      reef_type: 'fringing',
      reef_zone: 'back reef',
      exposure: 'sheltered',
    },
    {
      id: '3',
      name: '1203',
      reef_type: 'patch',
      reef_zone: 'fore reef',
      exposure: 'very sheltered',
    },
    {
      id: '4',
      name: 'Karang Kapal',
      reef_type: 'patch',
      reef_zone: 'back reef',
      exposure: 'exposed',
    },
  ],
  managementRegimes: [
    { id: '1', name: 'Fisheries Utilization' },
    { id: '2', name: 'Ankivonjy no-take' },
    { id: '3', name: 'Bureta tabu' },
  ],
}
