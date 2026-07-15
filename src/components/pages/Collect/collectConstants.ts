export const VALIDATION_STATUS = {
  error: 'error',
  // ignore is only used for the status of individual validations,
  // not the overall validations object.
  ignore: 'ignore',
  ok: 'ok',
  stale: 'stale',
  warning: 'warning',
}
Object.freeze(VALIDATION_STATUS)
