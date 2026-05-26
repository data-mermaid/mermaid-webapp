import { createUuid } from '../../../library/createUuid'

interface InvertAttribute {
  id: string
  name: string
  parent: string
  uiState_pushToApi?: boolean
  created_by?: string
  status?: number
}

interface AddInvertAttributeParams {
  invertAttributeParentId: string
  invertAttributeParentName: string
  newInvertAttributeName: string
}

interface InvertAttributeException {
  message: string
  existingInvertAttribute: InvertAttribute
}

interface DexiePerUserDataInstance {
  invert_attributes: {
    toArray(): Promise<InvertAttribute[]>
    put(attribute: InvertAttribute): Promise<string>
  }
}

interface ApiSyncInstance {
  pushThenPullFishOrInvertAttributes(
    dataType: 'invert_attributes',
  ): Promise<{ data: { invert_attributes: { updates: InvertAttribute[] } } }>
}

interface BaseClass {
  _isAuthenticatedAndReady: boolean
  _isOnlineAuthenticatedAndReady: boolean
  _isOfflineAuthenticatedAndReady: boolean
  _dexiePerUserDataInstance: DexiePerUserDataInstance
  _apiSyncInstance: ApiSyncInstance
  _notAuthenticatedAndReadyError: Error
  getInvertAttributes(): Promise<InvertAttribute[]>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => object

const InvertAttributesMixin = (Base: Constructor) =>
  class extends Base implements Partial<BaseClass> {
    getInvertAttributes = async function (this: BaseClass): Promise<InvertAttribute[]> {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.invert_attributes.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addInvertAttribute = async function (
      this: BaseClass,
      params: AddInvertAttributeParams,
    ): Promise<InvertAttribute> {
      const { invertAttributeParentId, invertAttributeParentName, newInvertAttributeName } = params
      if (!invertAttributeParentId || !invertAttributeParentName || !newInvertAttributeName) {
        return Promise.reject(
          new Error('addInvertAttribute was implemented with missing parameters'),
        )
      }

      const existingInvertAttribute = await this.getInvertAttributes()

      const existingMatchingInvertAttribute = existingInvertAttribute.filter(
        (invertAttribute) => invertAttribute.name === newInvertAttributeName,
      )

      const proposedInvertAttributeExists = existingMatchingInvertAttribute.length > 0

      if (proposedInvertAttributeExists) {
        const invertAttributeException: InvertAttributeException = {
          message: 'Invert attribute already exists',
          existingInvertAttribute: existingMatchingInvertAttribute[0],
        }

        return Promise.reject(invertAttributeException)
      }

      const newInvertAttributeObject: InvertAttribute = {
        id: createUuid(),
        name: newInvertAttributeName,
        parent: invertAttributeParentId,
        uiState_pushToApi: true,
      }

      if (this._isOnlineAuthenticatedAndReady) {
        const _protectAgainstNetworkStutter =
          await this._dexiePerUserDataInstance.invert_attributes.put(newInvertAttributeObject)

        return this._apiSyncInstance
          .pushThenPullFishOrInvertAttributes('invert_attributes')
          .then((response) => {
            const newInvertAttributeFromApi = response.data.invert_attributes.updates[0]

            return newInvertAttributeFromApi
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.invert_attributes
          .put(newInvertAttributeObject)
          .then(() => newInvertAttributeObject)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default InvertAttributesMixin
