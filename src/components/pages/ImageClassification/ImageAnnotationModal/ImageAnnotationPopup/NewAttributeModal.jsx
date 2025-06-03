import React from 'react'
import InputAutocomplete from '../../../../generic/InputAutocomplete/InputAutocomplete'
import {Select} from '../../../../generic/form'
import {NewAttributeModalContentContainer, NewAttributeModalFooterContainer,} from '../ImageAnnotationModal.styles'
import {ButtonPrimary, ButtonSecondary} from '../../../../generic/buttons'
import {IconPlus} from '../../../../icons'
import Modal from '../../../../generic/Modal/Modal'
import PropTypes from 'prop-types'
import {useTranslation} from 'react-i18next'


const NewAttributeModal = ({
                               benthicAttributeSelectOptions,
                               setSelectedBenthicAttr,
                               setSelectedGrowthForm,
                               selectedBenthicAttr,
                               growthFormSelectOptions,
                               handleCloseModal,
                               handleAddNewRowClick,
                           }) => {
    const {t} = useTranslation()
    return (<Modal
            title={t('image_classification.add_attribute')}
            isOpen={true}
            contentOverflowStyle="visible"
            onDismiss={handleCloseModal}
            allowCloseWithEscapeKey={false}
            maxWidth="fit-content"
            mainContent={<NewAttributeModalContentContainer>
                <label htmlFor="benthic-attribute-autocomplete">
                    {t('image_classification.benthic_attribute')}
                    <InputAutocomplete
                        id="benthic-attribute-autocomplete"
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
                        aria-labelledby="benthic-attribute-label"
                        options={benthicAttributeSelectOptions}
                        onChange={({value}) => setSelectedBenthicAttr(value)}
                        value={selectedBenthicAttr}
                        noResultsText={t('search.no_results')}
                    />
                </label>

                <label htmlFor="growth-forms">
                    {t('image_classification.growth_form')}
                    <Select id="growth-forms" onChange={(e) => setSelectedGrowthForm(e.target.value)}>
                        <option value=""></option>
                        {growthFormSelectOptions.map((growthForm) => (<option key={growthForm.id} value={growthForm.id}>
                                {growthForm.name}
                            </option>))}
                    </Select>
                </label>
            </NewAttributeModalContentContainer>}
            footerContent={<NewAttributeModalFooterContainer>
                <ButtonSecondary type="button" onClick={handleCloseModal}>
                    {t('buttons.cancel')}
                </ButtonSecondary>
                <ButtonPrimary
                    type="button"
                    disabled={!selectedBenthicAttr}
                    onClick={handleAddNewRowClick}
                >
                    <IconPlus/> {t('buttons.add_row')}
                </ButtonPrimary>
            </NewAttributeModalFooterContainer>}
        />)
}

export default NewAttributeModal

NewAttributeModal.propTypes = {
    benthicAttributeSelectOptions: PropTypes.array,
    setSelectedBenthicAttr: PropTypes.func.isRequired,
    setSelectedGrowthForm: PropTypes.func.isRequired,
    selectedBenthicAttr: PropTypes.string.isRequired,
    growthFormSelectOptions: PropTypes.array.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleAddNewRowClick: PropTypes.func.isRequired,
}
