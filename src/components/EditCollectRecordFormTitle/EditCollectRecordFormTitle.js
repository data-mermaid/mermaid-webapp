import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H2 } from '../generic/text'
import { getProtocolName } from '../../library/getProtocolName'
import { getObjectById } from '../../library/getObjectById'
import {
  fishBeltPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const TitleContainer = styled(H2)`
  display: inline-flex;
`

const TooltipText = styled('span')({
  visibility: 'hidden',
  width: '120px',
  paddingLeft: '10px',
  backgroundColor: '#004c76',
  color: '#fff',
  textAlign: 'center',
  padding: '5px 0',
  position: 'absolute',
  zIndex: 1,
  top: '120%',
  left: '50%',
  marginLeft: '-60px',
  ':after': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    marginLeft: '-5px',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: '#004c76 transparent transparent transparent',
    transform: 'rotate(180deg)',
  },
})

const Tooltip = styled('div')({
  marginRight: '10px',
  fontSize: '3rem',
  position: 'relative',
  display: 'inline-block',
  borderBottom: '1px dotted black',
  ':hover span': {
    visibility: 'visible',
    fontSize: '1.3rem',
  },
})

const ContentWithTooltip = ({ children, tooltipText }) => {
  return (
    <Tooltip>
      {children}
      <TooltipText>{tooltipText}</TooltipText>
    </Tooltip>
  )
}

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
      <ContentWithTooltip tooltipText="Protocol">
        {defaultTitle}
      </ContentWithTooltip>
      <ContentWithTooltip tooltipText="Site Name">
        {siteName}
      </ContentWithTooltip>
      <ContentWithTooltip tooltipText="Transect Number">
        {transectNumber}
      </ContentWithTooltip>
      <ContentWithTooltip tooltipText="Label">{label}</ContentWithTooltip>
    </TitleContainer>
  )
}

ContentWithTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  tooltipText: PropTypes.string.isRequired,
}
EditCollectRecordFormTitle.propTypes = {
  collectRecord: fishBeltPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

export default EditCollectRecordFormTitle
