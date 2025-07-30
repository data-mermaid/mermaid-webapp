const getProjectInitialValues = (projectRecord) => {
  return {
    name: projectRecord?.name ?? '',
    notes: projectRecord?.notes ?? '',
    tags: projectRecord?.tags ?? [],
    data_policy_beltfish: projectRecord?.data_policy_beltfish,
    data_policy_benthiclit: projectRecord?.data_policy_benthiclit,
    data_policy_benthicpqt: projectRecord?.data_policy_benthicpqt,
    data_policy_benthicpit: projectRecord?.data_policy_benthicpit,
    data_policy_bleachingqc: projectRecord?.data_policy_bleachingqc,
    data_policy_habitatcomplexity: projectRecord?.data_policy_habitatcomplexity,
    status: projectRecord?.status,
  }
}

export { getProjectInitialValues }
