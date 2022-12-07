import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
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

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const ResolveDuplicateButton = ({
  currentSelectValue,
  validationMessages,
  updateValueAndResetValidationForDuplicateWarning,
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
  const [recordToKeep, setRecordToKeep] = useState()

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

  const handleMergeSite = () => {
    setIsResolveDuplicateModalLoading(true)

    const findRecordId = recordToKeep === thisSite ? duplicateSiteData.id : currentSiteData.id
    const replaceRecordId = recordToKeep === thisSite ? currentSiteData.id : duplicateSiteData.id

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

  const handleKeepThisSite = () => {
    const confirmationText = confirmMergeModalContent(thisSite.toLowerCase())

    setConfirmationModalContent(confirmationText)
    setRecordToKeep(thisSite)
    openConfirmationModalOpen()
  }

  const handleKeepAnotherSite = () => {
    const confirmationText = confirmMergeModalContent(anotherSite.toLowerCase())

    setConfirmationModalContent(confirmationText)
    setRecordToKeep(anotherSite)
    openConfirmationModalOpen()
  }

  const mainContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead />
            <Thead>
              {thisSite} <ButtonCaution onClick={handleKeepThisSite}>{keepThisSite}</ButtonCaution>{' '}
              <ButtonCaution>{editSite}</ButtonCaution>
            </Thead>
            <Thead>
              {anotherSite}{' '}
              <ButtonCaution onClick={handleKeepAnotherSite}>{keepThisSite}</ButtonCaution>{' '}
              <ButtonCaution>{editSite}</ButtonCaution>
            </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title="Name"
            value={currentSiteData?.name}
            extraValue={duplicateSiteData?.name}
            recordToBeReplaced={recordToKeep}
          />
          <TableRowItem
            title="Country"
            options={countryOptions}
            value={currentSiteData?.country}
            extraValue={duplicateSiteData?.country}
            recordToBeReplaced={recordToKeep}
          />
          <TableRowItem
            title="Latitude"
            value={currentSiteData?.location?.coordinates[1]}
            extraValue={duplicateSiteData?.location?.coordinates[1]}
            recordToBeReplaced={recordToKeep}
          />
          <TableRowItem
            title="Longitude"
            value={currentSiteData?.location?.coordinates[0]}
            extraValue={duplicateSiteData?.location?.coordinates[0]}
            recordToBeReplaced={recordToKeep}
          />
          <Tr>
            <TdKey>Map</TdKey>
            <Td className={recordToKeep === anotherSite ? 'highlighted' : undefined}>
              <ResolveDuplicateSiteMap
                formLatitudeValue={currentSiteData?.location?.coordinates[1]}
                formLongitudeValue={currentSiteData?.location?.coordinates[0]}
              />
            </Td>
            <Td className={recordToKeep === thisSite ? 'highlighted' : undefined}>
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
            recordToBeReplaced={recordToKeep}
          />
          <TableRowItem
            title="Reef Type"
            options={reefTypeOptions}
            value={currentSiteData?.reef_type}
            extraValue={duplicateSiteData?.reef_type}
            recordToBeReplaced={recordToKeep}
          />
          <TableRowItem
            title="Reef Zone"
            options={reefZoneOptions}
            value={currentSiteData?.reef_zone}
            extraValue={duplicateSiteData?.reef_zone}
            recordToBeReplaced={recordToKeep}
          />
          <TableRowItem
            title="Notes"
            value={currentSiteData?.notes}
            extraValue={duplicateSiteData?.notes}
            recordToBeReplaced={recordToKeep}
          />
        </tbody>
      </Table>
      <Modal
        title="Confirm Merge Site"
        isOpen={isConfirmationModalOpen}
        onDismiss={closeConfirmationModalOpen}
        mainContent={<>{confirmationModalContent}</>}
        footerContent={
          <RightFooter>
            <ButtonSecondary onClick={closeConfirmationModalOpen}>{cancel}</ButtonSecondary>
            <ButtonCaution onClick={handleMergeSite}>{mergeSite}</ButtonCaution>
          </RightFooter>
        }
      />
      {isResolveDuplicateModalLoading && <LoadingModal />}
    </TableOverflowWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={closeResolveDuplicateModal}>{cancel}</ButtonSecondary>
      <ButtonCaution onClick={closeResolveDuplicateModal}>{keepBoth}</ButtonCaution>
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

ResolveDuplicateButton.propTypes = {
  currentSelectValue: PropTypes.string.isRequired,
  validationMessages: mermaidInputsPropTypes.validationMessagesPropType.isRequired,
  updateValueAndResetValidationForDuplicateWarning: PropTypes.func,
}

ResolveDuplicateButton.defaultProps = {
  updateValueAndResetValidationForDuplicateWarning: () => {},
}

export default ResolveDuplicateButton
