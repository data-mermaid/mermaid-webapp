import axios from 'axios'

const ApiSync = class {
  _apiBaseUrl

  _dexieInstance

  #persistLastRevisionNumbersPulled = (apiData) => {
    const objectToStore = {
      id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
      lastRevisionNumbers: {
        collectRecords: apiData.collect_records?.last_revision_num,
      },
    }

    return this._dexieInstance.lastRevisionNumbersPulled.put(objectToStore)
  }

  #getLastRevisionNumbersPulled = async () =>
    (await this._dexieInstance.lastRevisionNumbersPulled.toArray())[0]
      ?.lastRevisionNumbers

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

    const lastRevisionNumbersPulled = await this.#getLastRevisionNumbersPulled()

    return this._authenticatedAxios
      .post(`${this._apiBaseUrl}/pull/`, {
        collect_records: {
          project: projectId,
          profile: profileId,
          last_revision: lastRevisionNumbersPulled?.collectRecords ?? null,
        },
      })
      .then(async (response) => {
        await this.#persistLastRevisionNumbersPulled(response.data)
        const collectRecordUpdates =
          response.data.collect_records?.updates ?? []
        const collectRecordDeletes =
          response.data.collect_records?.deletes ?? []

        await this._dexieInstance.transaction(
          'rw',
          this._dexieInstance.collectRecords,
          () => {
            collectRecordUpdates.forEach((updatedRecord) => {
              this._dexieInstance.collectRecords.put(updatedRecord)
            })
            collectRecordDeletes.forEach(({ id }) => {
              this._dexieInstance.collectRecords.delete(id)
            })
          },
        )

        return response
      })
  }
}

export default ApiSync
