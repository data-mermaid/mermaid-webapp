import mockMermaidData from '../../../testUtilities/mockMermaidData'

const ChoicesMixin = (Base) =>
  class extends Base {
    getChoices = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.choices)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default ChoicesMixin
