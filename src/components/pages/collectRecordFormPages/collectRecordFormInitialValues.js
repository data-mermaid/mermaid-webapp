import { dateFormat } from '../../../library/strings/dateFormat'

const getCollectRecordDataInitialValues = (collectRecord) => {
  const collectRecordData = collectRecord?.data

  return {
    observers: collectRecordData?.observers ?? [],
  }
}

const getSampleInfoInitialValues = (collectRecord, transectType) => {
  const collectRecordData = collectRecord?.data

  return {
    depth: collectRecordData?.[transectType]?.depth ?? '',
    site: collectRecordData?.sample_event.site ?? '',
    management: collectRecordData?.sample_event.management ?? '',
    sample_date: dateFormat(collectRecordData?.sample_event.sample_date) ?? '',
    sample_time: collectRecordData?.[transectType]?.sample_time ?? '',
  }
}

const getTransectInitialValues = (collectRecord, transectType) => {
  const collectRecordData = collectRecord?.data

  // radios dont complain when initial value is undefined (because they have a value already and checked is the state that changes), but other inputs types do
  // we also dont want 'not reported' (has empty string value) to be selected by default, this is why some of these properties dont default to an ampty string, but others do
  return {
    number: collectRecordData?.[transectType]?.number ?? '',
    label: collectRecordData?.[transectType]?.label ?? '',
    len_surveyed: collectRecordData?.[transectType]?.len_surveyed ?? '',
    width: collectRecordData?.[transectType]?.width,
    size_bin: collectRecordData?.[transectType]?.size_bin,
    reef_slope: collectRecordData?.[transectType]?.reef_slope,
    notes: collectRecordData?.sample_event.notes ?? '',
    relative_depth: collectRecordData?.[transectType]?.relative_depth,
    visibility: collectRecordData?.[transectType]?.visibility,
    current: collectRecordData?.[transectType]?.current,
    tide: collectRecordData?.[transectType]?.tide,
  }
}

export { getCollectRecordDataInitialValues, getSampleInfoInitialValues, getTransectInitialValues }
