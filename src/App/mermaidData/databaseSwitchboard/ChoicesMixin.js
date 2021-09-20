const ChoicesMixin = (Base) =>
  class extends Base {
    getChoices = async () => {
      return this._isAuthenticatedAndReady
        ? (await this._dexieInstance.choices.toArray())[0].choices
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ChoicesMixin
