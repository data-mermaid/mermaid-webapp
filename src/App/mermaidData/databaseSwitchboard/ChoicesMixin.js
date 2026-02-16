const ChoicesMixin = (Base) =>
  class extends Base {
    getChoices = async function getChoices() {
      return this._isAuthenticatedAndReady
        ? (await this._dexiePerUserDataInstance.choices.toArray())[0].choices
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ChoicesMixin
