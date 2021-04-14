const projects = [
  {
    name: 'Project I',
    countries: ['Canada'],
    num_sites: 13,
    offlineReady: true,
    updated_on: '01/21/2020',
  },
  {
    name: 'Project II',
    countries: ['America'],
    num_sites: 36,
    offlineReady: true,
    updated_on: '21/21/2021',
  },
  {
    name: 'Project III',
    countries: ['England, Finland'],
    num_sites: 34,
    offlineReady: false,
    updated_on: '21/21/1992',
  },
  {
    name: 'Project IV',
    countries: ['Canada'],
    num_sites: 9,
    offlineReady: false,
    updated_on: '31/12/2011',
  },
  {
    name: 'Project V',
    countries: ['Mexico'],
    num_sites: 33,
    offlineReady: false,
    updated_on: '01/21/2001',
  },
]

const collectRecords = [
  {
    id: '1',
    data: {
      protocol: 'benthiclit',
      sample_event: {
        site: '3',
        management: '2',
        sample_date: '2021-3-11',
      },
      benthic_transect: {
        depth: 20,
        label: 'LIT-1',
        number: 5,
        sample_time: '22:55',
        len_surveyed: 10,
      },
    },
  },
  {
    id: '2',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some fish notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 6,
      },
    },
  },
  {
    id: '3',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '4',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '5',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '6',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '7',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '8',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '9',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '10',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
  {
    id: '11',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        notes: 'some lit notes',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
    },
  },
]

const sites = [
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
]

const managementRegimes = [
  { id: '1', name: 'Fisheries Utilization' },
  { id: '2', name: 'Ankivonjy no-take' },
  { id: '3', name: 'Bureta tabu' },
]

const choices = {
  belttransectwidths: {
    name: 'belttransectwidths',
    data: [
      {
        id: '228c932d-b5da-4464-b0df-d15a05c05c02',
        name: '10m',
        updated_on: '2020-01-10T01:54:17.336449Z',
        conditions: [
          {
            id: '2fe7f6bd-99d4-403d-9b11-08085b0158c6',
            name: '10m',
            updated_on: '2020-01-10T01:54:17.623308Z',
            size: null,
            operator: null,
            val: 10,
          },
        ],
      },
      {
        id: '7722daa4-58a2-43a8-96a2-584591ebb059',
        name: '20m',
        updated_on: '2020-01-10T01:54:17.338390Z',
        conditions: [
          {
            id: 'ce1c774a-9fe3-4c90-ae8e-d77b02ec1fc5',
            name: '20m',
            updated_on: '2020-01-10T01:54:17.631069Z',
            size: null,
            operator: null,
            val: 20,
          },
        ],
      },
      {
        id: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        name: '2m',
        updated_on: '2020-01-10T01:54:17.331894Z',
        conditions: [
          {
            id: 'bf0af7c0-fe55-408c-b1c4-756a6b1a8cf8',
            name: '2m',
            updated_on: '2020-01-10T01:54:17.603679Z',
            size: null,
            operator: null,
            val: 2,
          },
        ],
      },
      {
        id: 'fbba00a3-6a7f-4b82-8b3c-d624fb3d0805',
        name: '5m',
        updated_on: '2020-01-10T01:54:17.334308Z',
        conditions: [
          {
            id: '52d21b09-3233-42e8-a2e1-6529ac1e4ede',
            name: '5m',
            updated_on: '2020-01-10T01:54:17.616690Z',
            size: null,
            operator: null,
            val: 5,
          },
        ],
      },
      {
        id: '25f052f1-5cdc-4db5-8448-2242a37aa016',
        name: 'Mixed: < 10cm @ 2m, >= 10cm @ 5m',
        updated_on: '2020-01-10T02:20:10.185435Z',
        conditions: [
          {
            id: '683b77df-d939-4869-ab45-63b499e53ca9',
            name: '< 10.0cm @ Mixed: < 10cm @ 2m, >= 10cm @ 5m',
            updated_on: '2020-01-10T02:20:10.190887Z',
            size: 10.0,
            operator: '<',
            val: 2,
          },
          {
            id: 'ca74a0f2-3a92-4777-a54a-e58f110bf900',
            name: '>= 10.0cm @ Mixed: < 10cm @ 2m, >= 10cm @ 5m',
            updated_on: '2020-01-10T02:20:10.194418Z',
            size: 10.0,
            operator: '>=',
            val: 5,
          },
        ],
      },
      {
        id: '509c6e86-ba9f-47da-994f-8ef85853694e',
        name: 'Mixed: >10 cm & <35 cm @ 5 m, >=35 cm @ 20 m',
        updated_on: '2020-03-12T15:50:18.279668Z',
        conditions: [
          {
            id: '03b671dd-a8e7-43ed-a46a-d7c9b86d5b12',
            name: '< 35.0cm @ Mixed: >10 cm & <35 cm @ 5 m, >=35 cm @ 20 m',
            updated_on: '2020-03-12T15:50:18.285572Z',
            size: 35.0,
            operator: '<',
            val: 5,
          },
          {
            id: '4c10c995-e9f4-4fe0-8370-839c76a53710',
            name: '>= 35.0cm @ Mixed: >10 cm & <35 cm @ 5 m, >=35 cm @ 20 m',
            updated_on: '2020-03-12T15:50:18.290375Z',
            size: 35.0,
            operator: '>=',
            val: 20,
          },
        ],
      },
    ],
  },
  fishsizebins: {
    name: 'fishsizebins',
    data: [
      {
        id: '67c1356f-e0a7-4383-8034-77b2f36e1a49',
        name: '1',
        updated_on: '2017-09-27T19:51:10.438540Z',
        val: '1',
      },
      {
        id: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        name: '5',
        updated_on: '2017-09-27T19:51:10.438577Z',
        val: '5',
      },
      {
        id: '3232100a-a9b2-462c-955c-0dae7b72514f',
        name: '10',
        updated_on: '2017-09-27T19:51:10.438599Z',
        val: '10',
      },
      {
        id: 'ccef720a-a1c9-4956-906d-09ed56f16249',
        name: 'AGRRA',
        updated_on: '2020-03-13T18:34:46.244096Z',
        val: 'AGRRA',
      },
    ],
  },
  reefslopes: {
    name: 'reefslopes',
    data: [
      {
        id: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        name: 'flat',
        updated_on: '2017-09-27T19:51:10.387435Z',
        val: 0,
      },
      {
        id: '0afbf76b-c82b-43f8-9a1e-a9cb40d49c52',
        name: 'slope',
        updated_on: '2017-09-27T19:51:10.387479Z',
        val: 1,
      },
      {
        id: 'e754c2f8-1c21-4156-8f74-3de517b2712a',
        name: 'wall',
        updated_on: '2017-09-27T19:51:10.387509Z',
        val: 2,
      },
      {
        id: '12dc11ae-3a4b-4309-8fae-66f51398d96f',
        name: 'crest',
        updated_on: '2020-07-10T00:13:52.699137Z',
        val: 4,
      },
    ],
  },
}

const mockMermaidData = {
  projects,
  collectRecords,
  sites,
  managementRegimes,
  choices,
  getCollectRecord: (searchId) =>
    collectRecords.find((record) => record.id === searchId),
}

export default mockMermaidData
