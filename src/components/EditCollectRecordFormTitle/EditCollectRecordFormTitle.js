import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../theme'
import { getProtocolName } from '../../library/getProtocolName'
import { getObjectById } from '../../library/getObjectById'
import {
  fishBeltPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const TitleContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
`

const Tooltip = styled('h2')`
  margin-right: ${theme.spacing.medium};
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  position: relative;
  display: grid;
  place-items: center;
  cursor: pointer;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    opacity: 1;
  }
`
const TooltipText = styled('span')`
  opacity: 0;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  text-align: center;
  clip-path: polygon(
    calc(50% - 10px) 20%,
    50% 0,
    calc(50% + 10px) 20%,
    100% 20%,
    100% 100%,
    0 100%,
    0 20%
  );
  padding: ${theme.spacing.small};
  padding-top: ${theme.spacing.medium};
  top: 4rem;
  ${theme.typography.upperCase}
`

const ContentWithTooltip = ({ children, tooltipText, ariaLabelledBy }) => {
  return (
    <Tooltip tabIndex="0" id={ariaLabelledBy}>
      {children}
      <TooltipText role="tooltip" aria-labelledby={ariaLabelledBy}>
        {tooltipText}
      </TooltipText>
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
      <ContentWithTooltip
        tooltipText="Protocol"
        ariaLabelledBy="protocol-tooltip"
      >
        {defaultTitle}
      </ContentWithTooltip>
      <ContentWithTooltip
        tooltipText="Site Name"
        ariaLabelledBy="site-name-tooltip"
      >
        {siteName}
      </ContentWithTooltip>
      <ContentWithTooltip
        tooltipText="Transect Number"
        ariaLabelledBy="transect-number-tooltip"
      >
        {transectNumber}
      </ContentWithTooltip>
      <ContentWithTooltip tooltipText="Label" ariaLabelledBy="label-tooltip">
        {label}
      </ContentWithTooltip>
    </TitleContainer>
  )
}

ContentWithTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  tooltipText: PropTypes.string.isRequired,
  ariaLabelledBy: PropTypes.string.isRequired,
}
EditCollectRecordFormTitle.propTypes = {
  collectRecord: fishBeltPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

export default EditCollectRecordFormTitle
