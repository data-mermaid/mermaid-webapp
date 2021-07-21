import mockMermaidData from '../../../testUtilities/mockMermaidData'
import { getSampleDateLabel } from '../getSampleDateLabel'

const SubmittedRecordsMixin = (Base) =>
  class extends Base {
    #submittedRecordProtocolLabels = {
      fishbelt: 'Fish Belt',
      benthiclit: 'Benthic LIT',
      benthicpit: 'Benthic PIT',
      habitatcomplexity: 'Habitat Complexity',
      bleachingqc: 'Bleaching',
    }

    getSubmittedRecordsTable = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.submittedRecordsTable)
        : Promise.reject(this._notAuthenticatedAndReadyError)

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

    getSubmittedRecordsTableForUIDisplay = () => {
      return this._isAuthenticatedAndReady
        ? this.getSubmittedRecordsTable().then((submittedRecords) => {
            return submittedRecords.map((record) => ({
              ...record,
              uiLabels: {
                protocol: this.#submittedRecordProtocolLabels[record.protocol],
                site: record.site_name,
                management: record.management_name,
                sampleUnitNumber: record.sample_unit_number,
                size: record.size_display,
                depth: record.depth,
                sampleDate: getSampleDateLabel(record.sample_date),
                observers: record.observers.join(', '),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SubmittedRecordsMixin
