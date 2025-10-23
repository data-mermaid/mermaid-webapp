import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import useIsMounted from '../../library/useIsMounted'

import { getOptions } from '../../library/getOptions'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { ModalLoadingIndicatorWrapper, RightFooter } from '../generic/Modal'
import { Table, TableOverflowWrapper, Tr } from '../generic/Table/table'
import { InlineValidationButton } from '../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'
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
  const original = t('resolve_modal.original_mr')
  const duplicate = t('resolve_modal.duplicate_mr')
  const keepEither = t('resolve_modal.keep_mr')
  const editEither = t('resolve_modal.edit_mr')
  const keepBoth = t('resolve_modal.keep_both')
  const cancel = t('buttons.cancel')
  const merge = t('resolve_modal.merge')
  const getConfirmMergeMessage = (recordToKeep) =>
    t('resolve_modal.confirm_merge_message', {
      recordType: 'management regime',
      anotherRecord: recordToKeep,
    })
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
                toast.error(...getToastArguments(t('error.management_regime_records_unavailable')))
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
      no_take && t('management_rules.no_take_display'),
      open_access && t('management_rules.open_access_display'),
      access_restriction && t('management_rules.access_restriction_display'),
      periodic_closure && t('management_rules.periodic_closure_display'),
      size_limits && t('management_rules.size_limits_display'),
      gear_restriction && t('management_rules.gear_restriction_display'),
      species_restriction && t('management_rules.species_restriction_display'),
    ]
    const filteredRules = rules.filter((rule) => !!rule)
    const managementRules =
      no_take || open_access
        ? filteredRules[0]
        : t('management_rules.partial_restrictions', { rules: filteredRules.join(', ') })

    return managementRules
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
            toast.error(
              ...getToastArguments(t('error.find_replace_management_regime_failure')),
            )
          },
        })
      })
  }

  const handleKeepOriginalManagementRegime = () => {
    const confirmationText = getConfirmMergeMessage(original.toLowerCase())

    openConfirmationModalOpen()
    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(currentManagementRegimeData?.id)
  }

  const handleKeepDuplicateManagementRegime = () => {
    const confirmationText = getConfirmMergeMessage(duplicate.toLowerCase())

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

  const confirmationModalMainContent = <>{confirmationModalContent}</>

  const confirmationModalFooterContent = (
    <RightFooter>
      <ButtonSecondary onClick={closeConfirmationModalOpen}>{cancel}</ButtonSecondary>
      <ButtonCaution onClick={handleMergeManagementRegime}>
        <IconClose /> {merge}
      </ButtonCaution>
    </RightFooter>
  )

  const mainContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead />
            <Thead aria-label="Original Management">
              {original}{' '}
              <ButtonCaution onClick={handleKeepOriginalManagementRegime}>
                <IconCheck />
                {keepEither}
              </ButtonCaution>{' '}
              <ButtonCaution
                onClick={() => handleEditManagementRegime(currentManagementRegimeData?.id)}
              >
                <IconPen /> {editEither}
              </ButtonCaution>
            </Thead>
            <Thead aria-label="Duplicate Management">
              {duplicate}{' '}
              <ButtonCaution onClick={handleKeepDuplicateManagementRegime}>
                <IconCheck />
                {keepEither}
              </ButtonCaution>{' '}
              <ButtonCaution
                onClick={() => handleEditManagementRegime(duplicateManagementRegimeData?.id)}
              >
                <IconPen /> {editEither}
              </ButtonCaution>
            </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title={t('resolve_modal.field_name')}
            value={currentManagementRegimeData?.name}
            extraValue={duplicateManagementRegimeData?.name}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_secondary_name')}
            value={currentManagementRegimeData?.name_secondary}
            extraValue={duplicateManagementRegimeData?.name_secondary}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_year_established')}
            value={currentManagementRegimeData?.est_year}
            extraValue={duplicateManagementRegimeData?.est_year}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_area')}
            value={currentManagementRegimeData?.size}
            extraValue={duplicateManagementRegimeData?.size}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_parties')}
            options={managementPartyOptions}
            value={currentManagementRegimeData?.parties}
            extraValue={duplicateManagementRegimeData?.parties}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_compliance')}
            options={managementComplianceOptions}
            value={currentManagementRegimeData?.compliance}
            extraValue={duplicateManagementRegimeData?.compliance}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_rules')}
            value={getManagementRegimeRules(currentManagementRegimeData)}
            extraValue={getManagementRegimeRules(duplicateManagementRegimeData)}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('resolve_modal.field_notes')}
            value={currentManagementRegimeData?.notes}
            extraValue={duplicateManagementRegimeData?.notes}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
        </tbody>
      </Table>
      <Modal
        title={t('resolve_modal.confirm_modal_title_mr')}
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
      <ButtonSecondary onClick={handleCloseModal}>{cancel}</ButtonSecondary>
      <ButtonCaution onClick={handleKeepBoth}>
        <IconCheckAll />
        {keepBoth}
      </ButtonCaution>
    </RightFooter>
  )

  return (
    <>
      <InlineValidationButton type="button" onClick={openResolveDuplicateModal}>
        {t('resolve_modal.resolve_button')}
      </InlineValidationButton>
      <Modal
        title={t('resolve_modal.modal_title_mr')}
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
