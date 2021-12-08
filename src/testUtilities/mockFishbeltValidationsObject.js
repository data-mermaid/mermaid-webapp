export default {
  status: 'error',
  results: {
    data: {
      observers: [
        {
          name: 'required',
          fields: ['data.observers'],
          status: 'error',
          context: null,
          validation_id: 'c42a16612631db8b3f551e827f44703d',
        },
      ],
      sample_event: {
        notes: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        site: [
          {
            name: 'required',
            fields: ['data.sample_event.site'],
            status: 'error',
            context: null,
            validation_id: 'e7ed8f2c1fddc46b13011a50bd2497ac',
          },
          {
            name: 'unique_site_validator',
            fields: ['data.sample_event.site'],
            status: 'ok',
            context: null,
            validation_id: '46227dd7ef79f00d8f3529859c5ebfd9',
          },
        ],
        management: [
          {
            name: 'required',
            fields: ['data.sample_event.management'],
            status: 'error',
            context: null,
            validation_id: '51aa29c32842e2df62bdf4cfdb790943',
          },
          {
            code: 'management_not_found',
            name: 'unique_management_validator',
            fields: ['data.sample_event.management'],
            status: 'error',
            context: null,
            validation_id: '970d0593a68c6432ff2e439f8df1dbaf',
          },
        ],
        sample_date: [
          {
            name: 'required',
            fields: ['data.sample_event.sample_date'],
            status: 'error',
            context: null,
            validation_id: '0beda41c3b904d1b48732d1039cec880',
          },
          {
            code: 'invalid_sample_date',
            name: 'sample_date_validator',
            fields: ['data.sample_event.sample_date'],
            status: 'error',
            context: null,
            validation_id: 'aae43ffdcdd2f62dcbd2923cdbcdd066',
          },
        ],
      },
      obs_belt_fishes: [
        [
          {
            name: 'observation validation with ok status shoulnt show',
            status: 'ok',
            validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
          },
          {
            name: 'observation error',
            status: 'error',
            validation_id: '2b289dc99c02e9ae1c764e8a71cca3cc',
          },
          {
            name: 'observation warning',
            status: 'warning',
            validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
          },
        ],
      ],
      fishbelt_transect: {
        relative_depth: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        visibility: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        current: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        tide: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        reef_slope: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        label: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        depth: [
          {
            name: 'required',
            fields: ['data.fishbelt_transect.depth'],
            status: 'error',
            context: null,
            validation_id: '79e2d4a20bf38ef2f508503e7c125c4d',
          },
          {
            code: 'invalid_depth',
            name: 'depth_validator',
            fields: ['data.fishbelt_transect.depth'],
            status: 'warning',
            context: { depth_range: [0, 30] },
            validation_id: '01390e7d2cda542b47b2be2eb15d25c6',
          },
        ],
        width: [
          {
            name: 'required',
            fields: ['data.fishbelt_transect.width'],
            status: 'error',
            context: null,
            validation_id: '9271ae54919816ddb8026d64522ba35f',
          },
        ],
        number: [
          {
            name: 'required',
            fields: ['data.fishbelt_transect.number'],
            status: 'error',
            context: null,
            validation_id: 'b0781708804d47a9816741c010587f88',
          },
        ],
        size_bin: [
          {
            name: 'required',
            fields: ['data.fishbelt_transect.size_bin'],
            status: 'error',
            context: null,
            validation_id: '7ef514ed41d46f3e6e3f2e70a8fa6a68',
          },
        ],
        sample_time: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
        len_surveyed: [
          {
            validation_id: Math.random(),
            name: 'required',
            status: 'error',
          },
        ],
      },
    },
    $record: [
      {
        name: 'record level warning 1',
        status: 'warning',
        validation_id: '63043489232e671a4f9231fdf6d2665f',
      },
      {
        name: 'record level warning 2',
        status: 'warning',
        validation_id: 'fc7bf1e4ab2897e8749fd2030cbbc30c',
      },
      {
        name: 'record level error 1',
        status: 'error',
        validation_id: 'e7285cf5c4f441bdffdce83461c12d69',
      },
      {
        name: 'record level error 2',
        status: 'error',
        validation_id: 'ba4ac7677b7878d0a321cd3913f264ca',
      },
      {
        name: 'OK validation shouldnt show',
        status: 'ok',
        validation_id: '9175eb636ead3bc01a94378fe4d48af8',
      },
    ],
  },
}
