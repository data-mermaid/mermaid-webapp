export const getIsDataTypeProjectAssociated = (dataType) =>
  dataType === 'collect_records' ||
  dataType === 'project_managements' ||
  dataType === 'project_profiles' ||
  dataType === 'project_sites'
