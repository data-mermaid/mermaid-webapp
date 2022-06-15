import { dateFormat } from '../../../library/strings/dateFormat'

const getCollectRecordDataInitialValues = (collectRecord) => {
  const collectRecordData = collectRecord?.data

  return {
    observers: collectRecordData?.observers ?? [],
  }
}

const getSampleInfoInitialValues = (collectRecord) => {
  const collectRecordSampleEventData = collectRecord?.data?.sample_event

  return {
    site: collectRecordSampleEventData?.site ?? '',
    management: collectRecordSampleEventData?.management ?? '',
    sample_date: dateFormat(collectRecordSampleEventData?.sample_date) ?? '',
    notes: collectRecordSampleEventData?.notes ?? '',
  }
}

const getTransectInitialValues = (collectRecord, transectType) => {
  const collectRecordTransectTypeData = collectRecord?.data?.[transectType]

  // radios dont complain when initial value is undefined (because they have a value already and checked is the state that changes), but other inputs types do
  // we also dont want 'not reported' (has empty string value) to be selected by default, this is why some of these properties dont default to an ampty string, but others do
  return {
    depth: collectRecordTransectTypeData?.depth ?? '',
    number: collectRecordTransectTypeData?.number ?? '',
    label: collectRecordTransectTypeData?.label ?? '',
    len_surveyed: collectRecordTransectTypeData?.len_surveyed ?? '',
    width: collectRecordTransectTypeData?.width,
    sample_time: collectRecordTransectTypeData?.sample_time ?? '',
    size_bin: collectRecordTransectTypeData?.size_bin,
    reef_slope: collectRecordTransectTypeData?.reef_slope,
    relative_depth: collectRecordTransectTypeData?.relative_depth,
    visibility: collectRecordTransectTypeData?.visibility,
    current: collectRecordTransectTypeData?.current,
    tide: collectRecordTransectTypeData?.tide,
  }
}

const getBenthicPhotoQuadratAdditionalValues = (collectRecord) => {
  const benthicPhotoQuadratData = collectRecord?.data?.quadrat_transect

  return {
    quadrat_size: benthicPhotoQuadratData?.quadrat_size ?? '',
    num_quadrats: benthicPhotoQuadratData?.num_quadrats ?? '',
    num_points_per_quadrat: benthicPhotoQuadratData?.num_points_per_quadrat ?? '',
  }
}

export {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
}
