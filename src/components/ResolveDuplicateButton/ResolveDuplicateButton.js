import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import { getObjectById } from '../../library/getObjectById'
import { getOptions } from '../../library/getOptions'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { Table, TableOverflowWrapper, Tr, Td } from '../generic/Table/table'
import { InlineValidationButton } from '../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'
import ResolveDuplicateSiteMap from '../mermaidMap/ResolveDuplicateSiteMap'

const Thead = styled.th`
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const TdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`

const getItemLabelOrName = (itemOptions, itemValue) =>
  getObjectById(itemOptions, itemValue)?.name || getObjectById(itemOptions, itemValue)?.label

const TableRowItem = ({ title, options, value, duplicateValue }) => {
  const optionNameOrLabel = (rowValue) =>
    Array.isArray(rowValue)
      ? rowValue.map((item) => getItemLabelOrName(options, item)).join(', ')
      : getItemLabelOrName(options, rowValue)

  const rowItemValue = options ? optionNameOrLabel(value) : value
  const rowItemDuplicateValue = options ? optionNameOrLabel(duplicateValue) : duplicateValue

  return (
    <Tr>
      <TdKey>{title}</TdKey>
      <Td>{rowItemValue}</Td>
      <Td>{rowItemDuplicateValue}</Td>
    </Tr>
  )
}

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
            duplicateValue={duplicateSiteData.name}
          />
          <TableRowItem
            title="Country"
            options={countryOptions}
            value={currentSiteData.country}
            duplicateValue={duplicateSiteData.country}
          />
          <TableRowItem
            title="Latitude"
            value={currentSiteData?.location?.coordinates[1]}
            duplicateValue={duplicateSiteData?.location?.coordinates[1]}
          />
          <TableRowItem
            title="Longitude"
            value={currentSiteData?.location?.coordinates[0]}
            duplicateValue={duplicateSiteData?.location?.coordinates[0]}
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
            duplicateValue={duplicateSiteData.exposure}
          />
          <TableRowItem
            title="Reef Type"
            options={reefTypeOptions}
            value={currentSiteData.reef_type}
            duplicateValue={duplicateSiteData.reef_type}
          />
          <TableRowItem
            title="Reef Zone"
            options={reefZoneOptions}
            value={currentSiteData.reef_zone}
            duplicateValue={duplicateSiteData.reef_zone}
          />
          <TableRowItem
            title="Notes"
            value={currentSiteData.notes}
            duplicateValue={duplicateSiteData.notes}
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

export default ResolveDuplicateButton
