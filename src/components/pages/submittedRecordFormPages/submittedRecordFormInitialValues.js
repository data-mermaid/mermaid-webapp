const getSubmittedRecordDataInitialValues = (submittedRecord, transectType) => {
  return {
    site: submittedRecord?.sample_event.site ?? '',
    management: submittedRecord?.sample_event.management ?? '',
    sample_date: submittedRecord?.sample_event.sample_date ?? '',
    sample_time: submittedRecord?.[transectType].sample_time ?? '',
    depth: submittedRecord?.[transectType]?.depth ?? '',
    number: submittedRecord?.[transectType]?.number ?? '',
    label: submittedRecord?.[transectType]?.label ?? '',
    len_surveyed: submittedRecord?.[transectType]?.len_surveyed ?? '',
    notes: submittedRecord?.sample_event?.notes ?? '',
    width: submittedRecord?.[transectType]?.width ?? '',
    size_bin: submittedRecord?.[transectType]?.size_bin ?? '',
    reef_slope: submittedRecord?.[transectType]?.reef_slope ?? '',
    current: submittedRecord?.[transectType]?.current ?? '',
    visibility: submittedRecord?.[transectType]?.visibility ?? '',
    relative_depth: submittedRecord?.[transectType]?.relative_depth ?? '',
    tide: submittedRecord?.[transectType]?.tide ?? '',
  }
}

export { getSubmittedRecordDataInitialValues }
