import { apiDataTypes } from '../../library/constants/constants'

export const getIsDataTypeProjectAssociated = (apiDataType) =>
  apiDataType === apiDataTypes.collectRecords ||
  apiDataType === apiDataTypes.projectManagements ||
  apiDataType === apiDataTypes.projectSites ||
  apiDataType === apiDataTypes.projectProfiles
