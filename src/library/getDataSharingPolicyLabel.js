/**
 * @param {string || number} policyCode
 * @returns {string}
 */

export const getDataSharingPolicyLabel = (policyCode) => {
  return {
    10: 'Private',
    50: 'Public Summary',
    100: 'Public',
  }[policyCode]
}
