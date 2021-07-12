import mockMermaidData from '../../../testUtilities/mockMermaidData'

const SubmittedRecordsMixin = (Base) =>
  class extends Base {
    #submittedRecordProtocolLabels = {
      fishbelt: 'Fish Belt',
      benthiclit: 'Benthic LIT',
      benthicpit: 'Benthic PIT',
      habitatcomplexity: 'Habitat Complexity',
      bleachingqc: 'Bleaching',
    }

    #getSampleDateLabel = (record) => {
      const { sample_date } = record

      if (!sample_date) return undefined

      const [year, month, day] = sample_date.split('-')
      const zeroIndexedMonth = month - 1
      const locale = navigator.language ?? 'en-US'

      return new Date(year, zeroIndexedMonth, day).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    getSubmittedRecords = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.submittedRecords)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getSubmittedRecord = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSubmittedRecords().then((records) =>
            records.find((record) => record.id === id),
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedRecordsForUIDisplay = () => {
      return this._isAuthenticatedAndReady
        ? this.getSubmittedRecords().then((submittedRecords) => {
            return submittedRecords.map((record) => ({
              ...record,
              uiLabels: {
                protocol: this.#submittedRecordProtocolLabels[record.protocol],
                site: record.site_name,
                management: record.management_name,
                sampleUnitNumber: record.sample_unit_number,
                size: record.size_display,
                depth: record.depth,
                sampleDate: this.#getSampleDateLabel(record),
                observers: record.observers.join(', '),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SubmittedRecordsMixin
