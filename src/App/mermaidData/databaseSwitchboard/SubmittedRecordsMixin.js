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

    getSubmittedRecords = function getSubmittedRecords(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? this._authenticatedAxios
            .get(`${this._apiBaseUrl}/projects/${projectId}/sampleunitmethods/`, {
              params: {
                protocol: `fishbelt,benthiclit,benthicpit,habitatcomplexity,bleachingqc`,
              },
            })
            .then((apiResults) => apiResults.data.results)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedFishBeltTransectRecord = function getSubmittedFishBeltTransectRecord(
      projectId,
      id,
    ) {
      if (!(id || projectId)) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? this._authenticatedAxios
            .get(`${this._apiBaseUrl}/projects/${projectId}/beltfishtransectmethods/${id}`)
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedRecordsForUIDisplay = function getSubmittedRecordsForUIDisplay(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

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

    moveToCollect = function moveToCollect({ projectId, submittedRecordId }) {
      if (!projectId || !submittedRecordId) {
        Promise.reject(
          new Error(
            'The function, moveToCollect requires an object parameter with projectId and submittedRecordId properties',
          ),
        )
      }

      return this._isOnlineAuthenticatedAndReady
        ? this._authenticatedAxios
            .put(
              `${this._apiBaseUrl}/projects/${projectId}/beltfishtransectmethods/${submittedRecordId}/edit/`,
            )
            .then(() =>
              this._apiSyncInstance.pushThenPullEverythingForAProjectButChoices(projectId),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SubmittedRecordsMixin
