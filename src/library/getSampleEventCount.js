/**
 * Counts the number of sample events in the records array that match the specified protocol
 *
 * @param {Array} records - An array of sample event records to filter
 * @param {string} protocol - The protocol type to count (e.g., 'benthicpit', 'fishbelt')
 * @returns {number} The count of records matching the specified protocol
 */
export const getSampleEventCount = (records, protocol) => {
  if (!records || !Array.isArray(records)) {
    return 0
  }

  return records.filter((record) => record?.protocol === protocol).length
}
