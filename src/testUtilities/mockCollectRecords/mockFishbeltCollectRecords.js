export default [
  {
    id: '1',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '3',
        management: '2',
        sample_date: '2021-3-11',
      },
      fishbelt_transect: {
        depth: 20,
        label: 'FB-1',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some fish notes',
        number: 5,
        sample_time: '11:55',
        len_surveyed: 10,
        relative_depth: '8f381e71-219e-469c-8c13-231b088fb861',
        visibility: '40702fad-754a-4982-8ca5-9b97106eca31',
        current: 'e5dcb32c-614d-44ed-8155-5911b7ee774a',
        tide: '79693274-4ec6-4052-afe1-4bb02eaa04ec',
      },
      observers: [
        {
          profile: '9d48bef5-728b-489e-8cb5-dc47c6452ef4',
          profile_name: 'Al Leonard',
        },
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
      ],
      obs_belt_fishes: [{ id: '9' }, { id: '8' }, { id: '7' }],
    },
    validations: null,
  },
  {
    id: '2',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some fish notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 6,
        relative_depth: '8f381e71-219e-469c-8c13-231b088fb861',
        visibility: '40702fad-754a-4982-8ca5-9b97106eca31',
        current: '60e11188-60d7-4f83-9658-27eb5a09c803',
        tide: '79693274-4ec6-4052-afe1-4bb02eaa04ec',
      },
      observers: [
        {
          profile: '9d48bef5-728b-489e-8cb5-dc47c6452ef4',
          profile_name: 'Al Leonard',
        },
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4ff5f714-43b3-4564-be1c-c6053f7c0487',
          profile_name: 'Nick Hoang',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
        {
          profile: '0e6dc8a8-ae45-4c19-813c-6d688ed6a7c3',
          profile_name: 'Dustin Sampson',
        },
        {
          profile: '3918d74a-7736-4cb9-b2ba-9db959779770',
          profile_name: 'Parmvir Thind',
        },
      ],
      obs_belt_fishes: [
        {
          size: 53,
          count: 1,
          alt_size: 12.5,
          size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
          fish_attribute: '0006e6d8-7501-4c2d-9cda-263194f8e58b',
          id: '1',
        },
        {
          size: 12.5,
          count: 2,
          alt_size: 12.5,
          size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
          fish_attribute: '03dbdfd1-2ce2-4b80-b470-210ef328a9d8',
          id: '2',
        },
        {
          size: 2.5,
          count: 4,
          alt_size: 2.5,
          size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
          fish_attribute: '03635b1f-95c2-4a80-be46-208152a69138',
          id: '3',
        },
      ],
    },
    validations: null,
  },
  {
    id: '3',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2001-11-22',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: '0e6dc8a8-ae45-4c19-813c-6d688ed6a7c3',
          profile_name: 'Dustin Sampson',
        },
        {
          profile: '3918d74a-7736-4cb9-b2ba-9db959779770',
          profile_name: 'Parmvir Thind',
        },
      ],
    },
    validations: { status: 'error' },
  },
  {
    id: '4',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2017-4-19',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: '4ff5f714-43b3-4564-be1c-c6053f7c0487',
          profile_name: 'Nick Hoang',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
        {
          profile: '0e6dc8a8-ae45-4c19-813c-6d688ed6a7c3',
          profile_name: 'Dustin Sampson',
        },
      ],
    },
    validations: { status: 'error' },
  },
  {
    project: '5',
    id: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2012-6-12',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: '9d48bef5-728b-489e-8cb5-dc47c6452ef4',
          profile_name: 'Al Leonard',
        },
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4ff5f714-43b3-4564-be1c-c6053f7c0487',
          profile_name: 'Nick Hoang',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '6',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2016-3-7',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4ff5f714-43b3-4564-be1c-c6053f7c0487',
          profile_name: 'Nick Hoang',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '7',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2020-8-13',
      },
      fishbelt_transect: {
        depth: 10,
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: '9d48bef5-728b-489e-8cb5-dc47c6452ef4',
          profile_name: 'Al Leonard',
        },
      ],
    },
    validations: null,
  },
  {
    id: '8',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2019-5-29',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
      ],
    },
    validations: { status: 'warning' },
  },
  {
    id: '9',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2019-5-29',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'error' },
  },
  {
    id: '10',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: null,
  },
  {
    id: '11',
    project: '5',
    profile: 'fake-id',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '13',
    profile: 'fake-id',
    project: '5',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '14',
    profile: 'fake-id',
    project: '5',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '15',
    profile: 'fake-id',
    project: '5',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '16',
    profile: 'fake-id',
    project: '5',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '17',
    profile: 'fake-id',
    project: '5',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
  {
    id: '12',
    profile: 'fake-id',
    project: 'shouldgetfilteredout',
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
        management: '3',
        sample_date: '2021-3-2',
      },
      fishbelt_transect: {
        depth: 10,
        label: 'FB-2',
        width: 'ab438b26-1ddf-4f62-b683-75dd364e614b',
        size_bin: 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
        reef_slope: 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
        notes: 'some lit notes',
        number: 2,
        sample_time: '11:55',
        len_surveyed: 5,
      },
      observers: [
        {
          profile: 'f250ad21-4b2a-41fc-98ee-8edbd4ef869c',
          profile_name: 'Melissa Nunes',
        },
        {
          profile: '4eb4bf65-6aee-4014-beee-04ad23484bcd',
          profile_name: 'Kim Fisher',
        },
      ],
    },
    validations: { status: 'ok' },
  },
]
