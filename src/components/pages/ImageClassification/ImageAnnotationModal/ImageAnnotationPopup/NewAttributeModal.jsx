import InputAutocomplete from '../../../../generic/InputAutocomplete/InputAutocomplete'
import { Select } from '../../../../generic/form'
import language from '../../../../../language'

const NewAttributeModal = ({
  benthicAttributeSelectOptions,
  setSelectedBenthicAttr,
  setSelectedGrowthForm,
  selectedBenthicAttr,
  growthFormSelectOptions,
}) => {
  return (
    <>
      <label htmlFor="benthic-attribute-autocomplete" style={{ display: 'inline-block' }}>
        {language.createNewOptionModal.newBenthicAttribute}
        <InputAutocomplete
          id="benthic-attribute-autocomplete"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
          aria-labelledby="benthic-attribute-label"
          options={benthicAttributeSelectOptions}
          onChange={({ value }) => setSelectedBenthicAttr(value)}
          value="t" //selectedBenthicAttr}
          noResultsText={language.autocomplete.noResultsDefault}
        />
      </label>

      <label htmlFor="growth-forms" style={{ display: 'inline-block', paddingLeft: '1rem' }}>
        <span>{language.createNewOptionModal.growthForms}</span>
        <Select
          id="growth-forms"
          label={language.createNewOptionModal.growthForms}
          onChange={(e) => setSelectedGrowthForm(e.target.value)}
        >
          <option value=""></option>
          {growthFormSelectOptions.map((growthForm) => (
            <option key={growthForm.id} value={growthForm.id}>
              {growthForm.name}
            </option>
          ))}
        </Select>
      </label>
    </>
  )
}

export default NewAttributeModal
