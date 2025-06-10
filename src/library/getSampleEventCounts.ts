/**
 * Counts the number of sample events in the records array grouped by protocol
 *
 * @param {Array} records - An array of sample event records to filter
 * @returns {Object} An object mapping each protocol to its count
 */
interface SampleEventRecord {
  protocol: string
}

export const getSampleEventCounts = (
  records: SampleEventRecord[] | null | undefined,
): Record<string, number> => {
  if (!records || !Array.isArray(records)) {
    return {}
  }

  return records.reduce((acc: Record<string, number>, record) => {
    acc[record.protocol] = (acc[record.protocol] || 0) + 1
    return acc
  }, {})
}
