// Field applicability per finance solution type. Kept in one place so the edit
// modal and the finance solutions table agree on which fields apply to which
// fs_type. See "GFCR change requests - May_2026.csv".
export const BUSINESS_OR_FINANCIAL_MECHANISM_TYPES = ['business', 'financial_mechanism']
export const LOCAL_ENTERPRISE_TYPES = ['financial_facility', 'business', 'financial_mechanism']
export const NUMBER_OF_SOLUTIONS_SUPPORTED_BY_TYPES = ['taf', 'ctf', 'financial_facility']

export const isGenderSmartApplicable = (fsType) =>
  BUSINESS_OR_FINANCIAL_MECHANISM_TYPES.includes(fsType)

export const isLocalEnterpriseApplicable = (fsType) => LOCAL_ENTERPRISE_TYPES.includes(fsType)

export const isUsedAnIncubatorApplicable = (fsType) =>
  BUSINESS_OR_FINANCIAL_MECHANISM_TYPES.includes(fsType)

export const isNumberOfSolutionsSupportedApplicable = (fsType) =>
  NUMBER_OF_SOLUTIONS_SUPPORTED_BY_TYPES.includes(fsType)
