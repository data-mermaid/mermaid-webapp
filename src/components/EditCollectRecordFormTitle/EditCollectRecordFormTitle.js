import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getProtocolName } from '../../library/getProtocolName'
import { getObjectById } from '../../library/getObjectById'
import {
  fishBeltPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const TitleContainer = styled.div`
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
    borderColor: 'black transparent transparent transparent',
    transform: 'rotate(180deg)',
  },
})

const Tooltip = styled('div')({
  marginRight: '10px',
  fontSize: '3rem',
  fontWeight: 'bold',
  position: 'relative',
  display: 'inline-block',
  borderBottom: '1px dotted black',
  ':hover span': {
    visibility: 'visible',
    fontSize: '1.3rem',
  },
})

const LabelHover = ({ children, tooltip }) => {
  return (
    <Tooltip>
      {children}
      <TooltipText>{tooltip}</TooltipText>
    </Tooltip>
  )
}

const EditCollectRecordFormTitle = ({ collectRecord, sites }) => {
  const collectRecordData = collectRecord.data
  const siteId = collectRecordData.sample_event?.site
  const collectRecordProtocol = collectRecordData.protocol

  const transectType =
    collectRecordProtocol === 'fishbelt' ? 'fishbelt_transect' : ''

  const defaultTitle = getProtocolName(collectRecordProtocol) || 'Fish Belt'
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber = collectRecordData[transectType]?.number || ''
  const label = collectRecordData[transectType]?.label || ''

  return (
    <TitleContainer id="collect-form-title">
      <LabelHover tooltip="Protocol">{defaultTitle}</LabelHover>
      <LabelHover tooltip="Site Name">{siteName}</LabelHover>
      <LabelHover tooltip="Transect Number">{transectNumber}</LabelHover>
      <LabelHover tooltip="Label">{label}</LabelHover>
    </TitleContainer>
  )
}

LabelHover.propTypes = {
  children: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
}
EditCollectRecordFormTitle.propTypes = {
  collectRecord: fishBeltPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

export default EditCollectRecordFormTitle
