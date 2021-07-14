import React from 'react'
import styled from 'styled-components'
import { getProtocolName } from '../../library/getProtocolName'
import { getObjectById } from '../../library/getObjectById'
import { TooltipWithText } from '../generic/tooltip'
const TitleContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const EditCollectRecordFormTitle = ({ collectRecord, sites }) => {
  const collectRecordData = collectRecord.data
  const siteId = collectRecordData.sample_event?.site
  const collectRecordProtocol = collectRecordData.protocol

  const transectType =
    collectRecordProtocol === 'fishbelt' ? 'fishbelt_transect' : undefined

  const defaultTitle = getProtocolName(collectRecordProtocol) || 'Fish Belt'
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber = collectRecordData[transectType]?.number || ''
  const label = collectRecordData[transectType]?.label || ''

  return (
    <TitleContainer
      id="collect-form-title"
      data-testid="edit-collect-record-form-title"
    >
      <TooltipWithText
        as="h2"
        text={defaultTitle}
        tooltipText="Protocol"
        id="protocol-tooltip"
      />
      <TooltipWithText
        as="h2"
        text={siteName}
        tooltipText="Site Name"
        id="site-name-tooltip"
      />
      <TooltipWithText
        as="h2"
        text={transectNumber}
        tooltipText="Transect Number"
        id="transect-number-tooltip"
      />
      <TooltipWithText
        as="h2"
        text={label}
        tooltipText="Label"
        id="label-tooltip"
      />
    </TitleContainer>
  )
}

export default EditCollectRecordFormTitle
