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

    getSubmittedRecords = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.sampleUnitMethods)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getSubmittedFishBeltTransectRecords = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.fishBeltTransectMethods)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getSubmittedFishBeltTransectRecord = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSubmittedFishBeltTransectRecords().then((records) =>
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
                sampleDate: getSampleDateLabel(record.sample_date),
                observers: record.observers.join(', '),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SubmittedRecordsMixin
