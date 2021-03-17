import * as Yup from 'yup'

const getSampleInfoInitialValues = (collectRecordData, transect) => ({
  depth: collectRecordData[transect].depth,
  site: collectRecordData.sample_event.site,
  management: collectRecordData.sample_event.management,
  sample_date: collectRecordData.sample_event.sample_date,
  sample_time: collectRecordData[transect].sample_time,
})

const getTransectInitialValues = (collectRecordTransectData) => ({
  transectNumber: collectRecordTransectData.number,
})

const getSampleInfoValidationInfo = (mermaidData) => {
  const { sites, managementRegimes } = mermaidData

  const validSiteValues = sites.map((site) => site.id)

  const validManagementRegimeValues = managementRegimes.map(
    (regime) => regime.id,
  )

  return {
    site: Yup.string()
      .oneOf(validSiteValues, 'Invalid site')
      .required('Site is required'),
    management: Yup.string()
      .oneOf(validManagementRegimeValues, 'Invalid management regime')
      .required('Management Regime is required'),
    depth: Yup.number().required('Depth is required'),
  }
}

export {
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getSampleInfoValidationInfo,
}
