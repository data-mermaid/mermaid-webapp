export const VALIDATION_STATUS = {
  error: 'error',
  ignore: 'ignore',
  ok: 'ok',
  stale: 'stale',
  warning: 'warning',
}
Object.freeze(VALIDATION_STATUS)

export const RECORD_STATUS_LABELS = {
  // VALIDATION_STATUS.ignore is only used for the status of
  // individual validations, not the overall validations object.
  [VALIDATION_STATUS.error]: 'Errors',
  [VALIDATION_STATUS.ok]: 'Ready to submit',
  [VALIDATION_STATUS.stale]: 'Saved',
  [VALIDATION_STATUS.warning]: 'Warnings',
  [undefined]: 'Saved', // if a record is created offline, it will have no validation status yet.
}
Object.freeze(RECORD_STATUS_LABELS)
