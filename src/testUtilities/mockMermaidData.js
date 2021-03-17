export default {
  projects: [
    {
      name:
        'Karimunjawa National Park is a long name for a project, not as long as Karimunjawaawajnumirak',
      countries: ['Fiji'],
      num_sites: 23,
      offlineReady: true,
      updated_on: '01/21/2020',
    },
    {
      name: 'Gita Nada_MPA 2018',
      countries: ['Indonesia'],
      num_sites: 26,
      offlineReady: true,
      updated_on: '11/21/2021',
    },
    {
      name:
        'Survei Ekologi KKPD Aceh Besar, KKPD Pesisir Timur Sabang dan TWAL Pulau Weh',
      countries: ['Albania, Indonesia, Malaysia'],
      num_sites: 34,
      offlineReady: false,
      updated_on: '11/21/2021',
    },
    {
      name: "Belize Glover's Atoll 2019",
      countries: ['Fiji, Indonesia'],
      num_sites: 49,
      offlineReady: false,
      updated_on: '11/21/2021',
    },
    {
      name: 'XPDC Kei Kecil 2018',
      countries: ['Fiji'],
      num_sites: 33,
      offlineReady: false,
      updated_on: '11/21/2021',
    },
  ],
  collectRecords: [
    {
      id: '1',
      method: 'Benthic LIT',
      data: {
        protocol: 'benthiclit',
        sample_event: {
          site: '3',
          management: '2',
          sample_date: '2021-03-11',
        },
        benthic_transect: {
          depth: 20,
          label: 'LIT-1',
          number: 5,
          sample_time: '22:55',
        },
      },
    },
    {
      id: '2',
      method: 'Fish Belt',
      data: {
        protocol: 'fishbelt',
        sample_event: {
          site: '4',
          notes: 'some lit notes',
          management: '3',
          sample_date: '2021-03-02',
        },
        fishbelt_transect: {
          depth: 10,
          label: 'FB-2',
          number: 2,
          sample_time: '11:55',
        },
      },
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
