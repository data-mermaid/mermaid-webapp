import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import { getOptions } from '../../library/getOptions'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { Table, TableOverflowWrapper, Tr, Td, TdKey } from '../generic/Table/table'
import { InlineValidationButton } from '../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'
import ResolveDuplicateSiteMap from '../mermaidMap/ResolveDuplicateSiteMap'
import mermaidInputsPropTypes from '../mermaidInputs/mermaidInputsPropTypes'
import TableRowItem from '../generic/Table/TableRowItem'
import LoadingModal from '../LoadingModal/LoadingModal'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { IconCheck, IconCheckAll, IconClose, IconPen } from '../icons'
import { ensureTrailingSlash } from '../../library/strings/ensureTrailingSlash'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const ResolveDuplicateSiteButton = ({
  currentSelectValue,
  validationMessages,
  updateValueAndResetValidationForDuplicateWarning,
  ignoreNonObservationFieldValidations,
}) => {
  const {
    thisSite,
    anotherSite,
    keepThisSite,
    editSite,
    keepBoth,
    cancel,
    mergeSite,
    confirmMergeModalContent,
  } = language.resolveModal
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { projectId } = useParams()
  const history = useHistory()
  const currentProjectPath = useCurrentProjectPath()

  const [currentSiteData, setCurrentSiteData] = useState({})
  const [duplicateSiteData, setDuplicateSiteData] = useState({})
  const [countryOptions, setCountryOptions] = useState([])
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [isResolveDuplicateModalLoading, setIsResolveDuplicateModalLoading] = useState(false)

  const [isResolveDuplicateModalOpen, setIsResolveDuplicateModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [confirmationModalContent, setConfirmationModalContent] = useState('')
  const [recordIdToKeep, setRecordIdToKeep] = useState()

  useEffect(
    function loadSites() {
      const duplicateSiteId = validationMessages[0]?.context?.matches[0]

      if (databaseSwitchboardInstance && currentSelectValue && validationMessages) {
        const promises = [
          databaseSwitchboardInstance.getChoices(),
          databaseSwitchboardInstance.getSite(currentSelectValue),
          databaseSwitchboardInstance.getSite(duplicateSiteId),
        ]

        Promise.all(promises)
          .then(([choicesResponse, currentSiteResponse, duplicateSiteResponse]) => {
            setCountryOptions(getOptions(choicesResponse.countries))
            setExposureOptions(getOptions(choicesResponse.reefexposures))
            setReefTypeOptions(getOptions(choicesResponse.reeftypes))
            setReefZoneOptions(getOptions(choicesResponse.reefzones))
            setCurrentSiteData(currentSiteResponse)
            setDuplicateSiteData(duplicateSiteResponse)
          })
          .catch((error) => {
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(language.error.siteRecordUnavailable))
              },
            })
          })
      }
    },
    [databaseSwitchboardInstance, currentSelectValue, validationMessages, handleHttpResponseError],
  )

  const openResolveDuplicateModal = () => setIsResolveDuplicateModalOpen(true)
  const closeResolveDuplicateModal = () => setIsResolveDuplicateModalOpen(false)
  const openConfirmationModalOpen = () => setIsConfirmationModalOpen(true)
  const closeConfirmationModalOpen = () => setIsConfirmationModalOpen(false)

  const isOriginalSiteSelected = useMemo(
    () => recordIdToKeep === currentSiteData?.id,
    [recordIdToKeep, currentSiteData],
  )

  const isDuplicateSiteSelected = useMemo(
    () => recordIdToKeep === duplicateSiteData?.id,
    [recordIdToKeep, duplicateSiteData],
  )

  const handleMergeSite = () => {
    setIsResolveDuplicateModalLoading(true)

    const findRecordId = isOriginalSiteSelected ? duplicateSiteData.id : currentSiteData.id
    const replaceRecordId = isOriginalSiteSelected ? currentSiteData.id : duplicateSiteData.id

    databaseSwitchboardInstance
      .findAndReplaceSite(projectId, findRecordId, replaceRecordId)
      .then(() => {
        databaseSwitchboardInstance
          .getSitesWithoutOfflineDeleted(projectId)
          .then((sitesResponse) => {
            const sortedSitesResponse = sortArrayByObjectKey(sitesResponse, 'name')

            updateValueAndResetValidationForDuplicateWarning(replaceRecordId, sortedSitesResponse)
            setIsResolveDuplicateModalLoading(false)
            closeConfirmationModalOpen()
            closeResolveDuplicateModal()
          })
      })
      .catch((error) => {
        setIsResolveDuplicateModalLoading(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments('Failing find and replace site'))
          },
        })
      })
  }

  const handleKeepSite = (siteId) => {
    const confirmationText =
      siteId === currentSiteData?.id
        ? confirmMergeModalContent(thisSite.toLowerCase())
        : confirmMergeModalContent(anotherSite.toLowerCase())

    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(siteId)
    openConfirmationModalOpen()
  }

  const handleEditSite = (siteId) => {
    history.push(`${ensureTrailingSlash(currentProjectPath)}sites/${siteId}`)
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
        <IconClose /> {mergeSite}
      </ButtonCaution>
    </RightFooter>
  )

  const mainContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead />
            <Thead>
              {thisSite}{' '}
              <ButtonCaution onClick={() => handleKeepSite(currentSiteData?.id)}>
                <IconCheck />
                {keepThisSite}
              </ButtonCaution>{' '}
              <ButtonCaution onClick={() => handleEditSite(currentSiteData?.id)}>
                <IconPen /> {editSite}
              </ButtonCaution>
            </Thead>
            <Thead>
              {anotherSite}{' '}
              <ButtonCaution onClick={() => handleKeepSite(duplicateSiteData?.id)}>
                <IconCheck />
                {keepThisSite}
              </ButtonCaution>{' '}
              <ButtonCaution onClick={() => handleEditSite(duplicateSiteData?.id)}>
                <IconPen /> {editSite}
              </ButtonCaution>
            </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title="Name"
            value={currentSiteData?.name}
            extraValue={duplicateSiteData?.name}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <TableRowItem
            title="Country"
            options={countryOptions}
            value={currentSiteData?.country}
            extraValue={duplicateSiteData?.country}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <TableRowItem
            title="Latitude"
            value={currentSiteData?.location?.coordinates[1]}
            extraValue={duplicateSiteData?.location?.coordinates[1]}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <TableRowItem
            title="Longitude"
            value={currentSiteData?.location?.coordinates[0]}
            extraValue={duplicateSiteData?.location?.coordinates[0]}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <Tr>
            <TdKey>Map</TdKey>
            <Td className={isDuplicateSiteSelected ? 'highlighted' : undefined}>
              <ResolveDuplicateSiteMap
                formLatitudeValue={currentSiteData?.location?.coordinates[1]}
                formLongitudeValue={currentSiteData?.location?.coordinates[0]}
              />
            </Td>
            <Td className={isOriginalSiteSelected ? 'highlighted' : undefined}>
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
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <TableRowItem
            title="Reef Type"
            options={reefTypeOptions}
            value={currentSiteData?.reef_type}
            extraValue={duplicateSiteData?.reef_type}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <TableRowItem
            title="Reef Zone"
            options={reefZoneOptions}
            value={currentSiteData?.reef_zone}
            extraValue={duplicateSiteData?.reef_zone}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
          />
          <TableRowItem
            title="Notes"
            value={currentSiteData?.notes}
            extraValue={duplicateSiteData?.notes}
            isOriginalSiteSelected={isOriginalSiteSelected}
            isDuplicateSiteSelected={isDuplicateSiteSelected}
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
      {isResolveDuplicateModalLoading && <LoadingModal />}
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
        title="Resolve Duplicate"
        isOpen={isResolveDuplicateModalOpen}
        onDismiss={closeResolveDuplicateModal}
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </>
  )
}

ResolveDuplicateSiteButton.propTypes = {
  currentSelectValue: PropTypes.string.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType.isRequired,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func.isRequired,
  ignoreNonObservationFieldValidations: PropTypes.func.isRequired,
}

export default ResolveDuplicateSiteButton
