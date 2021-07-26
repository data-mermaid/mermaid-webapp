import axios from 'axios'
import {
  getLastRevisionNumbersPulled,
  persistLastRevisionNumbersPulled,
} from '../lastRevisionNumbers'

const ApiSync = class {
  _apiBaseUrl

  _dexieInstance

  constructor({ dexieInstance, apiBaseUrl, auth0Token }) {
    this._dexieInstance = dexieInstance
    this._apiBaseUrl = apiBaseUrl
    this._authenticatedAxios = auth0Token
      ? axios.create({
          headers: {
            Authorization: `Bearer ${auth0Token}`,
          },
        })
      : undefined
  }

  pullApiDataMinimal = async ({ projectId, profileId }) => {
    if (!profileId || !projectId) {
      throw new Error(
        'pullApiDataMinimal expects profileId, and projectId parameters',
      )
    }

    const lastRevisionNumbersPulled = await getLastRevisionNumbersPulled({
      dexieInstance: this._dexieInstance,
    })

    return this._authenticatedAxios
      .post(`${this._apiBaseUrl}/pull/`, {
        collect_records: {
          project: projectId,
          profile: profileId,
          last_revision: lastRevisionNumbersPulled?.collect_records ?? null,
        },
      })
      .then(async (response) => {
        await persistLastRevisionNumbersPulled({
          dexieInstance: this._dexieInstance,
          apiData: response.data,
        })
        const collectRecordUpdates =
          response.data.collect_records?.updates ?? []
        const collectRecordDeletes =
          response.data.collect_records?.deletes ?? []

        await this._dexieInstance.transaction(
          'rw',
          this._dexieInstance.collect_records,
          () => {
            collectRecordUpdates.forEach((updatedRecord) => {
              this._dexieInstance.collect_records.put(updatedRecord)
            })
            collectRecordDeletes.forEach(({ id }) => {
              this._dexieInstance.collect_records.delete(id)
            })
          },
        )

        return response
      })
  }
}

export default ApiSync
