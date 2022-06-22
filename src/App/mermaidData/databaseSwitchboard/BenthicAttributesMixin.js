const BenthicAttributesMixin = (Base) =>
  class extends Base {
    getBenthicAttributes = function getBenthicAttributes() {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.benthic_attributes.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default BenthicAttributesMixin
