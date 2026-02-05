import i18n from '../../i18n'

const POLICY_TOKENS: Record<number, string> = {
  10: 'data_sharing.private',
  50: 'data_sharing.public_summary',
  100: 'data_sharing.public',
}

export const getDataSharingPolicyLabel = (policyCode: number | string): string | undefined => {
  const numericCode = typeof policyCode === 'string' ? Number(policyCode) : policyCode

  if (Number.isNaN(numericCode)) {
    return undefined
  }

  const tokenKey = POLICY_TOKENS[numericCode]

  return tokenKey ? i18n.t(tokenKey) : undefined
}
