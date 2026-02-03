import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'

import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import useIsMounted from '../../library/useIsMounted'

import { useTranslation } from 'react-i18next'
import { getOptions } from '../../library/getOptions'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import { ButtonCaution, ButtonSecondary, InlineValidationButton } from '../generic/buttons'
import Modal, { ModalLoadingIndicatorWrapper, RightFooter } from '../generic/Modal'
import { Table, TableOverflowWrapper, Tr } from '../generic/Table/table'
import mermaidInputsPropTypes from '../mermaidInputs/mermaidInputsPropTypes'
import TableRowItem from '../generic/Table/TableRowItem'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { IconCheck, IconCheckAll, IconClose, IconPen } from '../icons'
import { ensureTrailingSlash } from '../../library/strings/ensureTrailingSlash'
import LoadingIndicator from '../LoadingIndicator'
import LoadingModal from '../LoadingModal/LoadingModal'

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const ResolveDuplicateMRButtonAndModal = ({
  currentSelectValue,
  validationMessages,
  updateValueAndResetValidationForDuplicateWarning,
  ignoreNonObservationFieldValidations,
}) => {
  const { t } = useTranslation()

  const managementRegimeDataUnavailableText = t('management_regimes.data_unavailable')
  const originalManagementRegime = t('management_regimes.original_mr')
  const duplicateManagementRegime = t('management_regimes.duplicate_mr')
  const partialRestrictionsLabel = t('management_regimes.partial_restrictions')
  const noTakeLabel = t('management_regimes.no_take')
  const openAccessLabel = t('management_regimes.open_access')
  const accessRestrictionLabel = t('management_regimes.access_restriction')
  const periodicClosureLabel = t('management_regimes.periodic_closure')
  const sizeLimitsLabel = t('management_regimes.size_limits')
  const gearRestrictionLabel = t('management_regimes.gear_restriction')
  const speciesRestrictionLabel = t('management_regimes.species_restriction')
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const currentProjectPath = useCurrentProjectPath()
  const isMounted = useIsMounted()

  const [currentManagementRegimeData, setCurrentManagementRegimeData] = useState({})
  const [duplicateManagementRegimeData, setDuplicateManagementRegimeData] = useState({})
  const [managementPartyOptions, setManagementPartyOptions] = useState([])
  const [managementComplianceOptions, setManagementComplianceOptions] = useState([])
  const [isResolveDuplicateModalLoading, setIsResolveDuplicateModalLoading] = useState(true)
  const [isMergeDuplicateLoading, setIsMergeDuplicateLoading] = useState(false)

  const [isResolveDuplicateModalOpen, setIsResolveDuplicateModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [confirmationModalContent, setConfirmationModalContent] = useState('')
  const [recordIdToKeep, setRecordIdToKeep] = useState()

  useEffect(
    function loadManagementRegimes() {
      const isDuplicateManagementRegimeMessage = validationMessages[0]?.code === 'similar_name'
      const duplicateManagementRegimeId =
        isDuplicateManagementRegimeMessage && validationMessages[0]?.context?.matches[0]

      if (databaseSwitchboardInstance && currentSelectValue && duplicateManagementRegimeId) {
        const promises = [
          databaseSwitchboardInstance.getChoices(),
          databaseSwitchboardInstance.getManagementRegime(currentSelectValue),
          databaseSwitchboardInstance.getManagementRegime(duplicateManagementRegimeId),
        ]

        Promise.all(promises)
          .then(
            ([
              choicesResponse,
              currentManagementRegimeResponse,
              duplicateManagementRegimeResponse,
            ]) => {
              if (isMounted.current) {
                setManagementPartyOptions(getOptions(choicesResponse.managementparties.data))
                setManagementComplianceOptions(
                  getOptions(choicesResponse.managementcompliances.data),
                )
                setCurrentManagementRegimeData(currentManagementRegimeResponse)
                setDuplicateManagementRegimeData(duplicateManagementRegimeResponse)
                setIsResolveDuplicateModalLoading(false)
              }
            },
          )
          .catch((error) => {
            setIsResolveDuplicateModalLoading(false)
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(managementRegimeDataUnavailableText))
              },
            })
          })
      }
    },
    [
      databaseSwitchboardInstance,
      isMounted,
      currentSelectValue,
      validationMessages,
      handleHttpResponseError,
      managementRegimeDataUnavailableText,
    ],
  )

  const openResolveDuplicateModal = () => setIsResolveDuplicateModalOpen(true)
  const closeResolveDuplicateModal = () => setIsResolveDuplicateModalOpen(false)
  const openConfirmationModalOpen = () => setIsConfirmationModalOpen(true)
  const closeConfirmationModalOpen = () => setIsConfirmationModalOpen(false)

  const isOriginalSelected = useMemo(() => {
    return recordIdToKeep === currentManagementRegimeData?.id
  }, [recordIdToKeep, currentManagementRegimeData])

  const isDuplicateSelected = useMemo(
    () => recordIdToKeep === duplicateManagementRegimeData?.id,
    [recordIdToKeep, duplicateManagementRegimeData],
  )

  const getManagementRegimeRules = (managementRegime) => {
    if (!managementRegime) {
      return ''
    }

    const {
      no_take,
      open_access,
      access_restriction,
      periodic_closure,
      size_limits,
      gear_restriction,
      species_restriction,
    } = managementRegime

    const rules = [
      no_take ? noTakeLabel : null,
      open_access ? openAccessLabel : null,
      access_restriction ? accessRestrictionLabel : null,
      periodic_closure ? periodicClosureLabel : null,
      size_limits ? sizeLimitsLabel : null,
      gear_restriction ? gearRestrictionLabel : null,
      species_restriction ? speciesRestrictionLabel : null,
    ].filter(Boolean)

    if (!rules.length) {
      return ''
    }

    if (no_take || open_access) {
      return rules[0]
    }

    return `${partialRestrictionsLabel}: ${rules.join(', ')}`
  }

  const handleMergeManagementRegime = () => {
    setIsMergeDuplicateLoading(true)

    const findRecordId = isOriginalSelected
      ? duplicateManagementRegimeData.id
      : currentManagementRegimeData.id
    const replaceRecordId = isOriginalSelected
      ? currentManagementRegimeData.id
      : duplicateManagementRegimeData.id

    databaseSwitchboardInstance
      .findAndReplaceManagementRegime(projectId, findRecordId, replaceRecordId)
      .then(() => {
        databaseSwitchboardInstance
          .getManagementRegimesWithoutOfflineDeleted(projectId)
          .then((managementRegimesResponse) => {
            const sortedManagementRegimesResponse = sortArrayByObjectKey(
              managementRegimesResponse,
              'name',
            )

            setIsMergeDuplicateLoading(false)
            closeConfirmationModalOpen()
            closeResolveDuplicateModal()
            updateValueAndResetValidationForDuplicateWarning(
              replaceRecordId,
              sortedManagementRegimesResponse,
            )
          })
      })
      .catch((error) => {
        setIsMergeDuplicateLoading(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('management_regimes.merge_failed')))
          },
        })
      })
  }

  const handleKeepOriginalManagementRegime = () => {
    const confirmationText = t('management_regimes.confirm_replace_mr', {
      anotherMR: originalManagementRegime.toLowerCase(),
    })

    openConfirmationModalOpen()
    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(currentManagementRegimeData?.id)
  }

  const handleKeepDuplicateManagementRegime = () => {
    const confirmationText = t('management_regimes.confirm_replace_mr', {
      anotherMR: duplicateManagementRegime.toLowerCase(),
    })

    openConfirmationModalOpen()
    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(duplicateManagementRegimeData?.id)
  }

  const handleEditManagementRegime = (managementRegimeId) => {
    navigate(`${ensureTrailingSlash(currentProjectPath)}management-regimes/${managementRegimeId}`)
  }

  const handleKeepBoth = () => {
    ignoreNonObservationFieldValidations()
    closeResolveDuplicateModal()
  }

  const handleCloseModal = () => {
    setRecordIdToKeep()
    closeResolveDuplicateModal()
  }

  const confirmationModalMainContent = (
    <p data-testid="resolve-duplicate-management-confirmation-message">
      {confirmationModalContent}
    </p>
  )

  const confirmationModalFooterContent = (
    <RightFooter>
      <ButtonSecondary onClick={closeConfirmationModalOpen}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonCaution
        onClick={handleMergeManagementRegime}
        data-testid="resolve-duplicate-management-confirm-merge"
      >
        <IconClose /> {t('buttons.merge')}
      </ButtonCaution>
    </RightFooter>
  )

  const mainContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead />
            <Thead
              aria-label={t('management_regimes.original_management')}
              data-testid="resolve-duplicate-management-original"
            >
              {originalManagementRegime}{' '}
              <ButtonCaution
                onClick={handleKeepOriginalManagementRegime}
                data-testid="resolve-duplicate-management-keep-original"
              >
                <IconCheck />
                {t('management_regimes.keep_mr')}
              </ButtonCaution>{' '}
              <ButtonCaution
                onClick={() => handleEditManagementRegime(currentManagementRegimeData?.id)}
                data-testid="resolve-duplicate-management-edit-original"
              >
                <IconPen /> {t('management_regimes.edit_mr')}
              </ButtonCaution>
            </Thead>
            <Thead
              aria-label={t('management_regimes.duplicate_management')}
              data-testid="resolve-duplicate-management-duplicate"
            >
              {duplicateManagementRegime}{' '}
              <ButtonCaution
                onClick={handleKeepDuplicateManagementRegime}
                data-testid="resolve-duplicate-management-keep-duplicate"
              >
                <IconCheck />
                {t('management_regimes.keep_mr')}
              </ButtonCaution>{' '}
              <ButtonCaution
                onClick={() => handleEditManagementRegime(duplicateManagementRegimeData?.id)}
                data-testid="resolve-duplicate-management-edit-duplicate"
              >
                <IconPen /> {t('management_regimes.edit_mr')}
              </ButtonCaution>
            </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title={t('name')}
            value={currentManagementRegimeData?.name}
            extraValue={duplicateManagementRegimeData?.name}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('management_regimes.secondary_name')}
            value={currentManagementRegimeData?.name_secondary}
            extraValue={duplicateManagementRegimeData?.name_secondary}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('management_regimes.year_est')}
            value={currentManagementRegimeData?.est_year}
            extraValue={duplicateManagementRegimeData?.est_year}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('management_regimes.area')}
            value={currentManagementRegimeData?.size}
            extraValue={duplicateManagementRegimeData?.size}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('management_regimes.parties')}
            options={managementPartyOptions}
            value={currentManagementRegimeData?.parties}
            extraValue={duplicateManagementRegimeData?.parties}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('management_regimes.compliance')}
            options={managementComplianceOptions}
            value={currentManagementRegimeData?.compliance}
            extraValue={duplicateManagementRegimeData?.compliance}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('management_regimes.rules')}
            value={getManagementRegimeRules(currentManagementRegimeData)}
            extraValue={getManagementRegimeRules(duplicateManagementRegimeData)}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('notes')}
            value={currentManagementRegimeData?.notes}
            extraValue={duplicateManagementRegimeData?.notes}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
        </tbody>
      </Table>
      <Modal
        title={t('management_regimes.confirm_merge_management')}
        testId="resolve-duplicate-management-confirmation-modal"
        isOpen={isConfirmationModalOpen}
        onDismiss={closeConfirmationModalOpen}
        mainContent={confirmationModalMainContent}
        footerContent={confirmationModalFooterContent}
      />
      {isMergeDuplicateLoading && <LoadingModal />}
    </TableOverflowWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={handleCloseModal}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonCaution onClick={handleKeepBoth} data-testid="resolve-duplicate-management-keep-both">
        <IconCheckAll />
        {t('buttons.keep_both')}
      </ButtonCaution>
    </RightFooter>
  )

  return (
    <>
      <InlineValidationButton
        type="button"
        onClick={openResolveDuplicateModal}
        data-testid="resolve-management-button"
      >
        {t('buttons.resolve')}
      </InlineValidationButton>
      <Modal
        title={t('management_regimes.resolve_duplicate_management')}
        testId="resolve-duplicate-management-modal"
        isOpen={isResolveDuplicateModalOpen}
        onDismiss={closeResolveDuplicateModal}
        mainContent={
          isResolveDuplicateModalLoading ? (
            <ModalLoadingIndicatorWrapper>
              <LoadingIndicator />
            </ModalLoadingIndicatorWrapper>
          ) : (
            mainContent
          )
        }
        footerContent={footerContent}
      />
    </>
  )
}

ResolveDuplicateMRButtonAndModal.propTypes = {
  currentSelectValue: PropTypes.string.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType.isRequired,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
}

export default ResolveDuplicateMRButtonAndModal
