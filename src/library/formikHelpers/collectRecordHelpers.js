import { dateFormat } from '../strings/dateFormat'

const getSampleInfoInitialValues = (collectRecordData, transectType) => {
  return {
    depth: collectRecordData?.[transectType]?.depth ?? '',
    site: collectRecordData?.sample_event.site ?? '',
    management: collectRecordData?.sample_event.management ?? '',
    sample_date: dateFormat(collectRecordData?.sample_event.sample_date) ?? '',
    sample_time: collectRecordData?.[transectType]?.sample_time ?? '',
  }
}

const getTransectInitialValues = (collectRecordData, transectType) => ({
  number: collectRecordData?.[transectType]?.number ?? '',
  label: collectRecordData?.[transectType]?.label ?? '',
  len_surveyed: collectRecordData?.[transectType]?.len_surveyed ?? '',
  width: collectRecordData?.[transectType]?.width ?? '',
  size_bin: collectRecordData?.[transectType]?.size_bin ?? '',
  reef_slope: collectRecordData?.[transectType]?.reef_slope ?? '',
  notes: collectRecordData?.sample_event.notes ?? '',
})

export { getSampleInfoInitialValues, getTransectInitialValues }
