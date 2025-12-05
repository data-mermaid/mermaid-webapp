import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'

import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import useIsMounted from '../../library/useIsMounted'

import language from '../../language'
import { getOptions } from '../../library/getOptions'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import { ButtonCaution, ButtonSecondary, InlineValidationButton } from '../generic/buttons'
import Modal, { ModalLoadingIndicatorWrapper, RightFooter } from '../generic/Modal'
import { Table, TableOverflowWrapper, Tr, Td, TableRowTdKey } from '../generic/Table/table'
import ResolveDuplicateSiteMap from '../mermaidMap/ResolveDuplicateSiteMap'
import mermaidInputsPropTypes from '../mermaidInputs/mermaidInputsPropTypes'
import TableRowItem from '../generic/Table/TableRowItem'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { IconCheck, IconCheckAll, IconClose, IconPen } from '../icons'
import { ensureTrailingSlash } from '../../library/strings/ensureTrailingSlash'
import LoadingModal from '../LoadingModal/LoadingModal'
import LoadingIndicator from '../LoadingIndicator'

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const ResolveDuplicateSiteButtonAndModal = ({
  currentSelectValue,
  validationMessages,
  updateValueAndResetValidationForDuplicateWarning,
  ignoreNonObservationFieldValidations,
}) => {
  const {
    original,
    duplicate,
    keepEither,
    editEither,
    keepBoth,
    cancel,
    merge,
    getConfirmMergeMessage,
  } = language.getResolveModalLanguage('site')
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const currentProjectPath = useCurrentProjectPath()
  const isMounted = useIsMounted()

  const [currentSiteData, setCurrentSiteData] = useState({})
  const [duplicateSiteData, setDuplicateSiteData] = useState({})
  const [countryOptions, setCountryOptions] = useState([])
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [isResolveDuplicateModalLoading, setIsResolveDuplicateModalLoading] = useState(true)
  const [isMergeDuplicateLoading, setIsMergeDuplicateLoading] = useState(false)

  const [isResolveDuplicateModalOpen, setIsResolveDuplicateModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [confirmationModalContent, setConfirmationModalContent] = useState('')
  const [recordIdToKeep, setRecordIdToKeep] = useState()

  useEffect(
    function loadSites() {
      const isDuplicateSiteMessage = validationMessages[0]?.code === 'not_unique_site'
      const duplicateSiteId = isDuplicateSiteMessage && validationMessages[0]?.context?.matches[0]

      if (databaseSwitchboardInstance && currentSelectValue && duplicateSiteId) {
        const promises = [
          databaseSwitchboardInstance.getChoices(),
          databaseSwitchboardInstance.getSite(currentSelectValue),
          databaseSwitchboardInstance.getSite(duplicateSiteId),
        ]

        Promise.all(promises)
          .then(([choicesResponse, currentSiteResponse, duplicateSiteResponse]) => {
            if (isMounted.current) {
              setCountryOptions(getOptions(choicesResponse.countries.data))
              setExposureOptions(getOptions(choicesResponse.reefexposures.data))
              setReefTypeOptions(getOptions(choicesResponse.reeftypes.data))
              setReefZoneOptions(getOptions(choicesResponse.reefzones.data))
              setCurrentSiteData(currentSiteResponse)
              setDuplicateSiteData(duplicateSiteResponse)
              setIsResolveDuplicateModalLoading(false)
            }
          })
          .catch((error) => {
            setIsResolveDuplicateModalLoading(false)
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(language.error.siteRecordUnavailable))
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

  const isOriginalSelected = useMemo(
    () => recordIdToKeep === currentSiteData?.id,
    [recordIdToKeep, currentSiteData],
  )

  const isDuplicateSelected = useMemo(
    () => recordIdToKeep === duplicateSiteData?.id,
    [recordIdToKeep, duplicateSiteData],
  )

  const handleMergeSite = () => {
    setIsMergeDuplicateLoading(true)

    const findRecordId = isOriginalSelected ? duplicateSiteData.id : currentSiteData.id
    const replaceRecordId = isOriginalSelected ? currentSiteData.id : duplicateSiteData.id

    databaseSwitchboardInstance
      .findAndReplaceSite(projectId, findRecordId, replaceRecordId)
      .then(() => {
        databaseSwitchboardInstance
          .getSitesWithoutOfflineDeleted(projectId)
          .then((sitesResponse) => {
            const sortedSitesResponse = sortArrayByObjectKey(sitesResponse, 'name')

            setIsMergeDuplicateLoading(false)
            closeConfirmationModalOpen()
            closeResolveDuplicateModal()
            updateValueAndResetValidationForDuplicateWarning(replaceRecordId, sortedSitesResponse)
          })
      })
      .catch((error) => {
        setIsMergeDuplicateLoading(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments('Failing find and replace site'))
          },
        })
      })
  }

  const handleKeepOriginalSite = () => {
    const confirmationText = getConfirmMergeMessage(original.toLowerCase())

    openConfirmationModalOpen()
    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(currentSiteData?.id)
  }

  const handleKeepDuplicateSite = () => {
    const confirmationText = getConfirmMergeMessage(duplicate.toLowerCase())

    openConfirmationModalOpen()
    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(duplicateSiteData?.id)
  }

  const handleEditSite = (siteId) => {
    navigate(`${ensureTrailingSlash(currentProjectPath)}sites/${siteId}`)
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
      <ButtonCaution onClick={handleMergeSite}>
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
            <Thead aria-label="Original Site">
              {original}{' '}
              <ButtonCaution onClick={handleKeepOriginalSite}>
                <IconCheck />
                {keepEither}
              </ButtonCaution>{' '}
              <ButtonCaution onClick={() => handleEditSite(currentSiteData?.id)}>
                <IconPen /> {editEither}
              </ButtonCaution>
            </Thead>
            <Thead aria-label="Duplicate Site">
              {duplicate}{' '}
              <ButtonCaution onClick={handleKeepDuplicateSite}>
                <IconCheck />
                {keepEither}
              </ButtonCaution>{' '}
              <ButtonCaution onClick={() => handleEditSite(duplicateSiteData?.id)}>
                <IconPen /> {editEither}
              </ButtonCaution>
            </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title="Name"
            value={currentSiteData?.name}
            extraValue={duplicateSiteData?.name}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title="Country"
            options={countryOptions}
            value={currentSiteData?.country}
            extraValue={duplicateSiteData?.country}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title="Latitude"
            value={currentSiteData?.location?.coordinates[1]}
            extraValue={duplicateSiteData?.location?.coordinates[1]}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title="Longitude"
            value={currentSiteData?.location?.coordinates[0]}
            extraValue={duplicateSiteData?.location?.coordinates[0]}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <Tr>
            <TableRowTdKey>Map</TableRowTdKey>
            <Td className={isDuplicateSelected ? 'highlighted' : undefined}>
              <ResolveDuplicateSiteMap
                formLatitudeValue={currentSiteData?.location?.coordinates[1]}
                formLongitudeValue={currentSiteData?.location?.coordinates[0]}
              />
            </Td>
            <Td className={isOriginalSelected ? 'highlighted' : undefined}>
              <ResolveDuplicateSiteMap
                formLatitudeValue={duplicateSiteData?.location?.coordinates[1]}
                formLongitudeValue={duplicateSiteData?.location?.coordinates[0]}
              />
            </Td>
          </Tr>
          <TableRowItem
            title="Exposure"
            options={exposureOptions}
            value={currentSiteData?.exposure}
            extraValue={duplicateSiteData?.exposure}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title="Reef Type"
            options={reefTypeOptions}
            value={currentSiteData?.reef_type}
            extraValue={duplicateSiteData?.reef_type}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title="Reef Zone"
            options={reefZoneOptions}
            value={currentSiteData?.reef_zone}
            extraValue={duplicateSiteData?.reef_zone}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title="Notes"
            value={currentSiteData?.notes}
            extraValue={duplicateSiteData?.notes}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
        </tbody>
      </Table>
      <Modal
        title="Confirm Merge Site"
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
        Resolve
      </InlineValidationButton>
      <Modal
        title="Resolve Duplicate Site"
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

ResolveDuplicateSiteButtonAndModal.propTypes = {
  currentSelectValue: PropTypes.string.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType.isRequired,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
}

export default ResolveDuplicateSiteButtonAndModal
