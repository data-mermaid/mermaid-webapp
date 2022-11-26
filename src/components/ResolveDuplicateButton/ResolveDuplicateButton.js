import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import styled from 'styled-components'
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

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const ResolveDuplicateButton = ({ currentSelectValue, validationMessages }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const [currentSiteData, setCurrentSiteData] = useState({})
  const [duplicateSiteData, setDuplicateSiteData] = useState({})
  const [countryOptions, setCountryOptions] = useState([])
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])

  const [isResolveDuplicateModalOpen, setIsResolveDuplicateModalOpen] = useState(false)

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

  const mainContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead />
            <Thead>This sample unit site</Thead>
            <Thead>Site in other sample units </Thead>
          </Tr>
        </thead>
        <tbody>
          <TableRowItem
            title="Name"
            value={currentSiteData.name}
            extraValue={duplicateSiteData.name}
          />
          <TableRowItem
            title="Country"
            options={countryOptions}
            value={currentSiteData.country}
            extraValue={duplicateSiteData.country}
          />
          <TableRowItem
            title="Latitude"
            value={currentSiteData?.location?.coordinates[1]}
            extraValue={duplicateSiteData?.location?.coordinates[1]}
          />
          <TableRowItem
            title="Longitude"
            value={currentSiteData?.location?.coordinates[0]}
            extraValue={duplicateSiteData?.location?.coordinates[0]}
          />
          <Tr>
            <TdKey>Map</TdKey>
            <Td>
              <ResolveDuplicateSiteMap
                formLatitudeValue={currentSiteData?.location?.coordinates[1]}
                formLongitudeValue={currentSiteData?.location?.coordinates[0]}
              />
            </Td>
            <Td>
              <ResolveDuplicateSiteMap
                formLatitudeValue={duplicateSiteData?.location?.coordinates[1]}
                formLongitudeValue={duplicateSiteData?.location?.coordinates[0]}
              />
            </Td>
          </Tr>
          <TableRowItem
            title="Exposure"
            options={exposureOptions}
            value={currentSiteData.exposure}
            extraValue={duplicateSiteData.exposure}
          />
          <TableRowItem
            title="Reef Type"
            options={reefTypeOptions}
            value={currentSiteData.reef_type}
            extraValue={duplicateSiteData.reef_type}
          />
          <TableRowItem
            title="Reef Zone"
            options={reefZoneOptions}
            value={currentSiteData.reef_zone}
            extraValue={duplicateSiteData.reef_zone}
          />
          <TableRowItem
            title="Notes"
            value={currentSiteData.notes}
            extraValue={duplicateSiteData.notes}
          />
        </tbody>
      </Table>
    </TableOverflowWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={closeResolveDuplicateModal}>Cancel</ButtonSecondary>
      <ButtonCaution onClick={closeResolveDuplicateModal}>Keep Both</ButtonCaution>
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
}

export default ResolveDuplicateButton
