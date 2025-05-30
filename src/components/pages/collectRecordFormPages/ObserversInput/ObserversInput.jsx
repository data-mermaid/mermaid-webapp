import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { formikPropType } from '../../../../library/formik/formikPropType'
import { getObserverNameOptions, getObserverNameToUse } from '../../../../library/observerHelpers'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import {
  observersPropType,
  observersValidationPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import getValidationPropertiesForInput from '../getValidationPropertiesForInput'
import language from '../../../../language'
import InputMuiChipSelectWithLabelAndValidation from '../../../mermaidInputs/InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation'
import { ButtonThatLooksLikeLinkUnderlined } from '../../../generic/buttons'

import theme from '../../../../theme'
import RemoveObserverModal from '../../../RemoveObserverModal/RemoveObserverModal'

const AdditionalInputContentWrapper = styled.div`
  font-size: ${theme.typography.smallFontSize};
  & button {
    color: ${theme.color.grey0};
    padding: 0;
  }
  & ul {
    color: ${theme.color.grey0};
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  & li {
    padding-top: ${theme.spacing.medium};
  }
`

const ObserversInput = ({
  areValidationsShowing,
  formik,
  ignoreNonObservationFieldValidations,
  usersBelongingToProject,
  resetNonObservationFieldValidations,
  validationsApiData,
  validationPropertiesWithDirtyResetOnInputChange,
  ...restOfProps
}) => {
  const [includedObserversNoLongerOnProject, setIncludedObserversNoLongerOnProject] = useState([])
  const [
    observerRemovedFromProjectToRemoveFromCollectRecord,
    setObserverRemovedFromProjectToRemoveFromCollectRecord,
  ] = useState()
  const [isRemoveObserverModalOpen, setIsRemoveObserverModalOpen] = useState(false)

  useEffect(
    function updateObserversNoLongerOnProject() {
      setIncludedObserversNoLongerOnProject(
        formik?.values?.observers.filter((observer) => {
          const doesUserBelongToProject = !!usersBelongingToProject.find(
            (belongingUser) => belongingUser.profile === observer.profile,
          )

          return !doesUserBelongToProject
        }),
      )
    },
    [formik?.values?.observers, usersBelongingToProject],
  )

  const validationPath = 'data.observers'
  const validationProperties = getValidationPropertiesForInput(
    validationsApiData?.observers,
    areValidationsShowing,
  )
  const observerNameOptions = getObserverNameOptions(usersBelongingToProject)
  const observerNameValues = formik.values.observers?.map(({ profile }) => profile) ?? []

  const getSelectedObservers = (observerIds) =>
    usersBelongingToProject.filter(({ profile }) =>
      !observerIds ? undefined : observerIds.includes(profile),
    )

  const handleObserversChange = (selectedItems) => {
    const selectedObservers = getSelectedObservers(selectedItems)

    formik.setFieldValue('observers', [...selectedObservers, ...includedObserversNoLongerOnProject])
    resetNonObservationFieldValidations({
      validationPath,
    })
  }

  const handleOpenObserversModal = (observer) => {
    setObserverRemovedFromProjectToRemoveFromCollectRecord(observer)
    setIsRemoveObserverModalOpen(true)
  }

  const handleCloseObserverModal = () => {
    setIsRemoveObserverModalOpen(false)
    setObserverRemovedFromProjectToRemoveFromCollectRecord(undefined)
  }

  const handleRemoveObserverWhoIsNoLongerOnProject = () => {
    const observersWithOneRemoved = formik.values.observers.filter(
      (observer) =>
        observer.profile !== observerRemovedFromProjectToRemoveFromCollectRecord.profile,
    )

    formik.setFieldValue('observers', observersWithOneRemoved)
    resetNonObservationFieldValidations({
      validationPath,
    })
    handleCloseObserverModal()
  }

  return (
    <>
      <InputWrapper {...restOfProps}>
        <H2>{language.pages.collectRecord.formSectionTitle.observers}</H2>
        <InputMuiChipSelectWithLabelAndValidation
          label="Observers"
          required={true}
          id="observers"
          options={observerNameOptions}
          value={observerNameValues}
          ignoreNonObservationFieldValidations={() => {
            ignoreNonObservationFieldValidations({ validationPath })
          }}
          resetNonObservationFieldValidations={() => {
            resetNonObservationFieldValidations({ validationPath })
          }}
          {...validationPropertiesWithDirtyResetOnInputChange(validationProperties, 'observers')}
          onChange={({ selectedItems }) => handleObserversChange(selectedItems)}
          additionalInputContent={
            <AdditionalInputContentWrapper>
              <label htmlFor="Observers">
                {language.pages.collectRecord.observersSelectHelper}
              </label>
              <ul>
                {includedObserversNoLongerOnProject.map((removedObserver) => (
                  <li key={removedObserver.id}>
                    <>
                      {language.pages.collectRecord.getObserverRemovedFromProjectMessage(
                        getObserverNameToUse(removedObserver),
                      )}{' '}
                      <ButtonThatLooksLikeLinkUnderlined
                        type="button"
                        onClick={() => handleOpenObserversModal(removedObserver)}
                      >
                        {language.pages.collectRecord.removeObserverFromCollectRecord}
                      </ButtonThatLooksLikeLinkUnderlined>
                    </>
                  </li>
                ))}
              </ul>
            </AdditionalInputContentWrapper>
          }
        />
      </InputWrapper>
      <RemoveObserverModal
        isOpen={isRemoveObserverModalOpen}
        observer={observerRemovedFromProjectToRemoveFromCollectRecord}
        onSubmit={handleRemoveObserverWhoIsNoLongerOnProject}
        onDismiss={handleCloseObserverModal}
      />
    </>
  )
}

ObserversInput.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
  formik: formikPropType.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
  usersBelongingToProject: observersPropType.isRequired,
  resetNonObservationFieldValidations: PropTypes.func.isRequired,
  validationsApiData: PropTypes.shape({ observers: observersValidationPropType }).isRequired,
  validationPropertiesWithDirtyResetOnInputChange: PropTypes.func.isRequired,
}

export default ObserversInput
