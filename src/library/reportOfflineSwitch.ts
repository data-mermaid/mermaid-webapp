import * as Sentry from '@sentry/react'

export type OfflineSwitchReason = 'request_no_response' | 'health_check_failed' | 'browser_offline'

// Once per reason per page load: enough to count affected sessions and see why, without a
// struggling server filling the Sentry quota with repeats.
const reportedReasons = new Set<OfflineSwitchReason>()

// Records why Collect switched itself offline. The user's own offline toggle isn't reported.
// A browser_offline report only arrives if the device can still reach Sentry.
export const reportOfflineSwitch = (
  reason: OfflineSwitchReason,
  context: Record<string, unknown> = {},
) => {
  if (reportedReasons.has(reason)) {
    return
  }
  reportedReasons.add(reason)

  Sentry.captureMessage('Collect switched to offline', {
    level: 'warning',
    tags: { offline_reason: reason },
    fingerprint: ['offline-switch', reason],
    extra: context,
  })
}
