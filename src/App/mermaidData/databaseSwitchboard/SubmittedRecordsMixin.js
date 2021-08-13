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

    getSubmittedRecords = (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return this._authenticatedAxios
          .get(`${this._apiBaseUrl}/projects/${projectId}/sampleunitmethods/`, {
            params: {
              protocol: `fishbelt,benthiclit,benthicpit,habitatcomplexity,bleachingqc`,
            },
          })
          .then((apiResults) => {
            return apiResults.data.results
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedFishBeltTransectRecord = (projectId, id) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return this._authenticatedAxios
          .get(
            `${this._apiBaseUrl}/projects/${projectId}/beltfishtransectmethods/${id}`,
          )
          .then((apiResults) => {
            return apiResults.data
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedRecordsForUIDisplay = (projectId) => {
      return this._isAuthenticatedAndReady
        ? this.getSubmittedRecords(projectId).then((submittedRecords) => {
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
