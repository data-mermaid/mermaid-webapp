import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { styled } from 'styled-components'
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
  const { t } = useTranslation()

  const siteDataUnavailableText = t('sites.data_unavailable')
  const originalSite = t('sites.original_site')
  const duplicateSite = t('sites.duplicate_site')

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
                toast.error(...getToastArguments(siteDataUnavailableText))
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
      siteDataUnavailableText,
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
            toast.error(...getToastArguments(t('sites.merge_failed')))
          },
        })
      })
  }

  const handleKeepOriginalSite = () => {
    const confirmationText = t('sites.confirm_replace_site', {
      anotherSite: originalSite.toLowerCase(),
    })

    openConfirmationModalOpen()
    setConfirmationModalContent(confirmationText)
    setRecordIdToKeep(currentSiteData?.id)
  }

  const handleKeepDuplicateSite = () => {
    const confirmationText = t('sites.confirm_replace_site', {
      anotherSite: duplicateSite.toLowerCase(),
    })

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

  const confirmationModalMainContent = (
    <p data-testid="resolve-duplicate-confirmation-message">{confirmationModalContent}</p>
  )

  const confirmationModalFooterContent = (
    <RightFooter>
      <ButtonSecondary onClick={closeConfirmationModalOpen}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonCaution onClick={handleMergeSite} data-testid="resolve-duplicate-merge">
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
              aria-label={t('sites.original_site')}
              data-testid="resolve-duplicate-original-site"
            >
              {originalSite}{' '}
              <ButtonCaution
                onClick={handleKeepOriginalSite}
                data-testid="resolve-duplicate-keep-original-site"
              >
                <IconCheck />
                {t('sites.keep_site')}
              </ButtonCaution>{' '}
              <ButtonCaution
                onClick={() => handleEditSite(currentSiteData?.id)}
                data-testid="resolve-duplicate-edit-original-site"
              >
                <IconPen /> {t('sites.edit_site')}
              </ButtonCaution>
            </Thead>
            <Thead
              aria-label={t('sites.duplicate_site')}
              data-testid="resolve-duplicate-duplicate-site"
            >
              {duplicateSite}{' '}
              <ButtonCaution
                onClick={handleKeepDuplicateSite}
                data-testid="resolve-duplicate-keep-duplicate-site"
              >
                <IconCheck />
                {t('sites.keep_site')}
              </ButtonCaution>{' '}
              <ButtonCaution
                onClick={() => handleEditSite(duplicateSiteData?.id)}
                data-testid="resolve-duplicate-edit-duplicate-site"
              >
                <IconPen /> {t('sites.edit_site')}
              </ButtonCaution>
            </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title={t('name')}
            value={currentSiteData?.name}
            extraValue={duplicateSiteData?.name}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('projects.country')}
            options={countryOptions}
            value={currentSiteData?.country}
            extraValue={duplicateSiteData?.country}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('sites.latitude')}
            value={currentSiteData?.location?.coordinates[1]}
            extraValue={duplicateSiteData?.location?.coordinates[1]}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('sites.longitude')}
            value={currentSiteData?.location?.coordinates[0]}
            extraValue={duplicateSiteData?.location?.coordinates[0]}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <Tr>
            <TableRowTdKey>{t('map.map')}</TableRowTdKey>
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
            title={t('sites.exposure')}
            options={exposureOptions}
            value={currentSiteData?.exposure}
            extraValue={duplicateSiteData?.exposure}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('sites.reef_type')}
            options={reefTypeOptions}
            value={currentSiteData?.reef_type}
            extraValue={duplicateSiteData?.reef_type}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('sites.reef_zone')}
            options={reefZoneOptions}
            value={currentSiteData?.reef_zone}
            extraValue={duplicateSiteData?.reef_zone}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
          <TableRowItem
            title={t('notes')}
            value={currentSiteData?.notes}
            extraValue={duplicateSiteData?.notes}
            isOriginalSelected={isOriginalSelected}
            isDuplicateSelected={isDuplicateSelected}
          />
        </tbody>
      </Table>
      <Modal
        title={t('sites.confirm_merge_site')}
        testId="resolve-duplicate-confirmation-modal"
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
      <ButtonCaution onClick={handleKeepBoth} data-testid="resolve-duplicate-keep-both">
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
        data-testid="resolve-site-button"
      >
        {t('buttons.resolve')}
      </InlineValidationButton>
      <Modal
        title={t('sites.resolve_duplicate_site')}
        testId="resolve-duplicate-site-modal"
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
