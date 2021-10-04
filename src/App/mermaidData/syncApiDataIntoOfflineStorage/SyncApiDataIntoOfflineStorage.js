import axios from 'axios'
import { pullApiData } from '../pullApiData'

const SyncApiDataIntoOfflineStorage = class {
  _apiBaseUrl

  _dexieInstance

  #getOnlyModifiedAndDeletedItems = (dataList) => {
    // new, edited, and deleted items will all have a uiState_pushToApi flag locally
    return dataList.filter((item) => item.uiState_pushToApi)
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

  #pullEverythingButProjectRelated = () => {
    const apiDataNamesToPullNonProject = [
      'benthic_attributes',
      'choices',
      'fish_families',
      'fish_genera',
      'fish_species',
      'projects',
    ]

    return pullApiData({
      dexieInstance: this._dexieInstance,
      auth0Token: this._auth0Token,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: apiDataNamesToPullNonProject,
    })
  }

  #pullOfflineProjects = async () => {
    const offlineReadyProjects = await this._dexieInstance.uiState_offlineReadyProjects.toArray()

    const apiDataNamesToPullNonProject = [
      'collect_records',
      'project_managements',
      'project_profiles',
      'project_sites',
    ]

    const pullProjectPromises = offlineReadyProjects.map((project) =>
      pullApiData({
        dexieInstance: this._dexieInstance,
        auth0Token: this._auth0Token,
        apiBaseUrl: this._apiBaseUrl,
        apiDataNamesToPull: apiDataNamesToPullNonProject,
        projectId: project.id,
      }),
    )

    return Promise.all(pullProjectPromises)
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

  pushThenPullEverything = async () => {
    await this.pushChanges()

    return Promise.all([
      this.#pullEverythingButProjectRelated(),
      this.#pullOfflineProjects(),
    ])
  }

  pushThenPullSpecies = async () => {
    await this.pushChanges()

    return pullApiData({
      dexieInstance: this._dexieInstance,
      auth0Token: this._auth0Token,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: ['fish_species'],
    })
  }

  pushThenPullEverythingForAProject = async (projectId) => {
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

  pushThenPullEverythingForAProjectButChoices = async (projectId) => {
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

  pushThenRemoveProjectFromOfflineStorage = async (projectId) => {
    await this.pushChanges()

    return this._dexieInstance.transaction(
      'rw',
      this._dexieInstance.collect_records,
      this._dexieInstance.project_managements,
      this._dexieInstance.project_profiles,
      this._dexieInstance.project_sites,
      this._dexieInstance.uiState_offlineReadyProjects,
      this._dexieInstance.uiState_lastRevisionNumbersPulled,
      async () => {
        this._dexieInstance.uiState_offlineReadyProjects.delete(projectId)

        this._dexieInstance.uiState_lastRevisionNumbersPulled
          .where('[dataType+projectId]')
          .anyOf([
            ['collect_records', projectId],
            ['project_managements', projectId],
            ['Project_Profiles', projectId],
            ['project_sites', projectId],
          ])
          .delete()
        this._dexieInstance.collect_records
          .where({ project: projectId })
          .delete()
        this._dexieInstance.project_managements
          .where({ project: projectId })
          .delete()
        this._dexieInstance.project_profiles
          .where({ project: projectId })
          .delete()
        this._dexieInstance.project_sites.where({ project: projectId }).delete()
      },
    )
  }
}

export default SyncApiDataIntoOfflineStorage
