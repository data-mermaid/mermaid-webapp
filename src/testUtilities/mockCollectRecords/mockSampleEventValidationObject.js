export const mockSampleEventValidationObject = {
  status: 'error',
  results: {
    data: {
      sample_event: {
        site: [
          {
            validation_id: Math.random(),
            code: 'not_unique_site',
            status: 'warning',
            context: { matches: ['4'] },
          },
        ],
        management: [
          {
            validation_id: Math.random(),
            code: 'similar_name',
            status: 'warning',
            context: { matches: ['1'] },
          },
        ],
      },
    },
  },
}
