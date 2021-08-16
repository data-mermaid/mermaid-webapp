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

      return this._isOnlineAuthenticatedAndReady
        ? this._authenticatedAxios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/sampleunitmethods/`,
              {
                params: {
                  protocol: `fishbelt,benthiclit,benthicpit,habitatcomplexity,bleachingqc`,
                },
              },
            )
            .then((apiResults) => {
              const dataFromApi = apiResults.data.results

              if (!dataFromApi) throw Error('submitted records not available')

              return dataFromApi
            })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedFishBeltTransectRecord = (projectId, id) => {
      if (!(id || projectId)) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? this._authenticatedAxios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/beltfishtransectmethods/${id}`,
            )
            .then((apiResults) => {
              const dataFromApi = apiResults.data

              if (!dataFromApi)
                throw Error('submitted fish belt transect not available')

              return dataFromApi
            })
        : Promise.reject(this._notAuthenticatedAndReadyError)
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
