export default {
  status: 'error',
  results: {
    data: {
      observers: [
        {
          code: 'required',
          name: 'required_validator',
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
            code: 'required',
            status: 'error',
          },
        ],
        site: [
          {
            code: 'required',
            name: 'required_validator',
            fields: ['data.sample_event.site'],
            status: 'error',
            context: null,
            validation_id: 'e7ed8f2c1fddc46b13011a50bd2497ac',
          },
          {
            code: null,
            name: 'unique_site_validator',
            fields: ['data.sample_event.site'],
            status: 'ok',
            context: null,
            validation_id: '46227dd7ef79f00d8f3529859c5ebfd9',
          },
        ],
        management: [
          {
            code: 'required',
            name: 'required_validator',
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
            code: 'required',
            name: 'required_validator',
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
            code: null,
            name: 'fish_family_subset_validator',
            fields: ['data.obs_belt_fishes'],
            status: 'ok',
            context: null,
            validation_id: 'fcb7300140f0df8b9a794fa286549bd2',
          },
          {
            code: 'invalid_fish_size',
            name: 'fish_size_validator',
            fields: ['data.obs_belt_fishes'],
            status: 'error',
            context: null,
            validation_id: '2b289dc99c02e9ae1c764e8a71cca3cc',
          },
          {
            code: 'invalid_fish_count',
            name: 'fish_count_validator',
            fields: ['data.obs_belt_fishes'],
            status: 'error',
            context: null,
            validation_id: 'ccb38683efc25838ec9b7ff026e78a19',
          },
        ],
      ],
      fishbelt_transect: {
        reef_slope: [
          {
            validation_id: Math.random(),
            code: 'required',
            status: 'error',
          },
        ],
        label: [
          {
            validation_id: Math.random(),
            code: 'required',
            status: 'error',
          },
        ],
        depth: [
          {
            code: 'required',
            name: 'required_validator',
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
            code: 'required',
            name: 'required_validator',
            fields: ['data.fishbelt_transect.width'],
            status: 'error',
            context: null,
            validation_id: '9271ae54919816ddb8026d64522ba35f',
          },
        ],
        number: [
          {
            code: 'required',
            name: 'required_validator',
            fields: ['data.fishbelt_transect.number'],
            status: 'error',
            context: null,
            validation_id: 'b0781708804d47a9816741c010587f88',
          },
        ],
        size_bin: [
          {
            code: 'required',
            name: 'required_validator',
            fields: ['data.fishbelt_transect.size_bin'],
            status: 'error',
            context: null,
            validation_id: '7ef514ed41d46f3e6e3f2e70a8fa6a68',
          },
        ],
        sample_time: [
          {
            validation_id: Math.random(),
            code: 'required',
            status: 'error',
          },
        ],
        len_surveyed: [
          {
            validation_id: Math.random(),
            code: 'required',
            status: 'error',
          },
        ],
      },
    },
    $record: [
      {
        code: null,
        name: 'total_fish_count_validator',
        fields: ['data.obs_belt_fishes'],
        status: 'ok',
        context: null,
        validation_id: '8fb039422eb29127929941ef86b64036',
      },
      {
        code: 5,
        name: 'observation_count_validator',
        fields: ['data.obs_belt_fishes'],
        status: 'warning',
        context: { observation_count_range: [5, 200] },
        validation_id: '63043489232e671a4f9231fdf6d2665f',
      },
      {
        code: 'low_density',
        name: 'biomass_validator',
        fields: ['data.obs_belt_fishes'],
        status: 'warning',
        context: { biomass_range: [50, 5000] },
        validation_id: 'fc7bf1e4ab2897e8749fd2030cbbc30c',
      },
      {
        code: 'invalid_transect_inputs',
        name: 'unique_transect_validator',
        fields: [
          'data.fishbelt_transect.label',
          'data.fishbelt_transect.number',
          'data.fishbelt_transect.width',
          'data.fishbelt_transect.relative_depth',
          'data.fishbelt_transect.depth',
          'data.sample_event.site',
          'data.sample_event.management',
          'data.sample_event.sample_date',
        ],
        status: 'error',
        context: null,
        validation_id: 'e7285cf5c4f441bdffdce83461c12d69',
      },
      {
        code: null,
        name: 'all_equal_validator',
        fields: ['data.obs_belt_fishes'],
        status: 'ok',
        context: null,
        validation_id: '9175eb636ead3bc01a94378fe4d48af8',
      },
      {
        code: 'unsuccessful_dry_submit',
        name: 'dry_submit_validator',
        fields: ['__all__'],
        status: 'error',
        context: {
          dry_submit_results: {
            depth: ['A valid number is required.'],
            width: ['Width is required'],
            number: ['A valid integer is required.'],
            size_bin: ['Fish size bin is required'],
            len_surveyed: ['A valid number is required.'],
          },
        },
        validation_id: 'ba4ac7677b7878d0a321cd3913f264ca',
      },
    ],
  },
}
