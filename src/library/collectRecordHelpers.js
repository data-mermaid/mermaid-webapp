import * as Yup from 'yup'
import { dateFormat } from './dateFormat'

const getSampleInfoInitialValues = (collectRecordData, transectType) => {
  // console.log('here', collectRecordData, transectType)
  return {
    depth: collectRecordData?.[transectType]?.depth ?? '',
    site: collectRecordData?.sample_event.site ?? '',
    management: collectRecordData?.sample_event.management ?? '',
    sample_date: dateFormat(collectRecordData?.sample_event.sample_date) ?? '',
    sample_time: collectRecordData?.[transectType]?.sample_time ?? '',
  }
}

const getTransectInitialValues = (collectRecordData, transectType) => ({
  transectNumber: collectRecordData?.[transectType]?.number ?? '',
  label: collectRecordData?.[transectType]?.label ?? '',
  transectLengthSurveyed: collectRecordData?.[transectType]?.len_surveyed ?? '',
  width: collectRecordData?.[transectType]?.width ?? '',
  fishSizeBin: collectRecordData?.[transectType]?.size_bin ?? '',
  reefSlope: collectRecordData?.[transectType]?.reef_slope ?? '',
  notes: collectRecordData?.sample_event.notes ?? '',
})

const getSampleInfoValidationInfo = ({ sites, managementRegimes }) => {
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
