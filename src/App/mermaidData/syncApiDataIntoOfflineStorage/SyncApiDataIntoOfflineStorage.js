import axios from 'axios'
import { pullApiData } from '../pullApiData'

const SyncApiDataIntoOfflineStorage = class {
  _apiBaseUrl

  _dexieInstance

  #getOnlyModifiedAndDeletedItems = (dataList) => {
    // new, edited, and deleted items will all have a _pushToApi flag locally
    return dataList.filter((item) => item._pushToApi)
  }

  constructor({ dexieInstance, apiBaseUrl, auth0Token }) {
    this._dexieInstance = dexieInstance
    this._apiBaseUrl = apiBaseUrl
    this._auth0Token = auth0Token
    this._authenticatedAxios = auth0Token
      ? axios.create({
          headers: {
            Authorization: `Bearer ${auth0Token}`,
          },
        })
      : undefined
  }

  pushChanges = async () => {
    return Promise.all([
      this._dexieInstance.benthic_attributes.toArray(),
      this._dexieInstance.collect_records.toArray(),
      this._dexieInstance.fish_species.toArray(),
      this._dexieInstance.project_managements.toArray(),
      this._dexieInstance.project_profiles.toArray(),
      this._dexieInstance.project_sites.toArray(),
      this._dexieInstance.projects.toArray(),
    ]).then(
      ([
        benthic_attributes,
        collect_records,
        fish_species,
        project_managements,
        project_profiles,
        project_sites,
        projects,
      ]) => {
        return this._authenticatedAxios.post(
          `${this._apiBaseUrl}/push/`,
          {
            benthic_attributes: this.#getOnlyModifiedAndDeletedItems(
              benthic_attributes,
            ),
            collect_records: this.#getOnlyModifiedAndDeletedItems(
              collect_records,
            ),
            fish_species: this.#getOnlyModifiedAndDeletedItems(fish_species),
            project_managements: this.#getOnlyModifiedAndDeletedItems(
              project_managements,
            ),
            project_profiles: this.#getOnlyModifiedAndDeletedItems(
              project_profiles,
            ),
            project_sites: this.#getOnlyModifiedAndDeletedItems(project_sites),
            projects: this.#getOnlyModifiedAndDeletedItems(projects),
          },
          {
            params: {
              force: true,
            },
          },
        )
      },
    )
  }

  pullEverythingButProjectRelated = () => {
    const apiDataNamesToPullNonProject = [
      'benthic_attributes',
      'choices',
      'fish_families',
      'fish_genera',
      'fish_species',
      'projects',
    ]

    return this.pushChanges().then(() =>
      pullApiData({
        dexieInstance: this._dexieInstance,
        auth0Token: this._auth0Token,
        apiBaseUrl: this._apiBaseUrl,
        apiDataNamesToPull: apiDataNamesToPullNonProject,
      }),
    )
  }

  pullEverything = async (projectId) => {
    const allTheDataNames = [
      'benthic_attributes',
      'choices',
      'collect_records',
      'fish_families',
      'fish_genera',
      'fish_species',
      'project_managements',
      'project_profiles',
      'project_sites',
      'projects',
    ]

    await this.pushChanges()

    const pullResponse = await pullApiData({
      dexieInstance: this._dexieInstance,
      auth0Token: this._auth0Token,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: allTheDataNames,
      projectId,
    })

    await this._dexieInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
  }

  pullEverythingButChoices = async (projectId) => {
    const apiDataNamesToPullNonProject = [
      'benthic_attributes',
      'collect_records',
      'fish_families',
      'fish_genera',
      'fish_species',
      'project_managements',
      'project_profiles',
      'project_sites',
      'projects',
    ]

    await this.pushChanges()

    const pullResponse = await pullApiData({
      dexieInstance: this._dexieInstance,
      auth0Token: this._auth0Token,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: apiDataNamesToPullNonProject,
      projectId,
    })

    await this._dexieInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
  }
}

export default SyncApiDataIntoOfflineStorage
