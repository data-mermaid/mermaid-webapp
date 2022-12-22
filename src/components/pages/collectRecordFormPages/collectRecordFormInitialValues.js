import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'

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
    sample_date: getSampleDateLabel(collectRecordSampleEventData?.sample_date) ?? '',
  }
}

const getTransectInitialValues = (collectRecord, sampleUnit) => {
  const collectRecordSampleUnitData = collectRecord?.data?.[sampleUnit]

  // radios dont complain when initial value is undefined (because they have a value already and checked is the state that changes), but other inputs types do
  // we also dont want 'not reported' (has empty string value) to be selected by default, this is why some of these properties dont default to an ampty string, but others do
  return {
    depth: collectRecordSampleUnitData?.depth ?? '',
    number: collectRecordSampleUnitData?.number ?? '',
    label: collectRecordSampleUnitData?.label ?? '',
    len_surveyed: collectRecordSampleUnitData?.len_surveyed ?? '',
    width: collectRecordSampleUnitData?.width,
    sample_time: collectRecordSampleUnitData?.sample_time ?? '',
    size_bin: collectRecordSampleUnitData?.size_bin,
    reef_slope: collectRecordSampleUnitData?.reef_slope,
    relative_depth: collectRecordSampleUnitData?.relative_depth,
    visibility: collectRecordSampleUnitData?.visibility,
    current: collectRecordSampleUnitData?.current,
    tide: collectRecordSampleUnitData?.tide,
    notes: collectRecordSampleUnitData?.notes,
  }
}

const getBenthicPhotoQuadratAdditionalValues = (collectRecord) => {
  const benthicPhotoQuadratData = collectRecord?.data?.quadrat_transect

  return {
    quadrat_number_start: benthicPhotoQuadratData?.quadrat_number_start ?? '',
    quadrat_size: benthicPhotoQuadratData?.quadrat_size ?? '',
    num_quadrats: benthicPhotoQuadratData?.num_quadrats ?? '',
    num_points_per_quadrat: benthicPhotoQuadratData?.num_points_per_quadrat ?? '',
  }
}

const getBenthicPitAdditionalValues = (collectRecord) => {
  return {
    interval_start: collectRecord?.data?.interval_start ?? 1,
    interval_size: collectRecord?.data?.interval_size ?? '',
  }
}

const getHabitatComplexityAdditionalValues = (collectRecord) => {
  return {
    interval_size: collectRecord?.data?.interval_size ?? '',
  }
}

const getBleachingQuadratCollection = (collectRecord) => {
  const quadratCollection = collectRecord?.data?.quadrat_collection

  return {
    depth: quadratCollection?.depth ?? '',
    number: quadratCollection?.number ?? '',
    label: quadratCollection?.label ?? '',
    quadrat_size: quadratCollection?.quadrat_size ?? '',
    width: quadratCollection?.width,
    sample_time: quadratCollection?.sample_time ?? '',
    size_bin: quadratCollection?.size_bin,
    relative_depth: quadratCollection?.relative_depth,
    visibility: quadratCollection?.visibility,
    current: quadratCollection?.current,
    tide: quadratCollection?.tide,
    notes: quadratCollection?.notes,
  }
}

export {
  getBenthicPhotoQuadratAdditionalValues,
  getBenthicPitAdditionalValues,
  getBleachingQuadratCollection,
  getCollectRecordDataInitialValues,
  getHabitatComplexityAdditionalValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
}
