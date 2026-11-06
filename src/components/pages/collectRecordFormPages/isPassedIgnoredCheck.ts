// Validate keeps a check ignored once a diver has ignored it: the API copies `ignore` from the
// stored result onto the new one, whatever the new status is. The API always sends `code`, and
// a check that now passes sends it as null, so an ignored result with a null code is a passed
// check with nothing to show. Every API warning has a code, so a warning the diver ignored
// always keeps its message.
const isPassedIgnoredCheck = (validation: unknown): boolean => {
  if (!validation || typeof validation !== 'object') {
    return false
  }

  const { status, code } = validation as { status?: unknown; code?: unknown }

  return status === 'ignore' && code === null
}

export default isPassedIgnoredCheck
