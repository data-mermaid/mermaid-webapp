import React from 'react'
import styled, { css } from 'styled-components/macro'
import PropTypes from 'prop-types'
import theme from '../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { getObjectById } from '../../library/getObjectById'
import { TooltipWithText, TooltipPopup } from '../generic/tooltip'
import { fishBeltPropType, sitePropType } from '../../App/mermaidData/mermaidDataProptypes'

const TitleContainer = styled('div')`
  display: flex;
  white-space: nowrap;
  gap: 1rem;
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: ${theme.typography.smallFontSize};
  `)}
`
const ProjectTooltip = styled(TooltipWithText)`
  ${TooltipPopup} {
    min-width: max-content;
    text-align: center;
  }
`
const RecordFormTitle = ({ submittedRecordOrCollectRecordDataProperty, sites }) => {
  const defaultTitle = 'Fish Belt'
  const siteId = submittedRecordOrCollectRecordDataProperty.sample_event?.site

  const siteName = getObjectById(sites, siteId)?.name ?? ''
  const transectNumber = submittedRecordOrCollectRecordDataProperty.fishbelt_transect?.number ?? ''
  const label = submittedRecordOrCollectRecordDataProperty.fishbelt_transect?.label ?? ''

  return (
    <TitleContainer id="collect-form-title" data-testid="edit-collect-record-form-title">
      <ProjectTooltip
        forwardedAs="h2"
        text={defaultTitle}
        tooltipText="Protocol"
        id="protocol-tooltip"
      />
      <ProjectTooltip
        forwardedAs="h2"
        text={siteName}
        tooltipText="Site Name"
        id="site-name-tooltip"
      />
      <ProjectTooltip
        forwardedAs="h2"
        text={transectNumber}
        tooltipText="Transect Number"
        id="transect-number-tooltip"
      />
      <ProjectTooltip forwardedAs="h2" text={label} tooltipText="Label" id="label-tooltip" />
    </TitleContainer>
  )
}

RecordFormTitle.propTypes = {
  submittedRecordOrCollectRecordDataProperty: fishBeltPropType,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

RecordFormTitle.defaultProps = {
  submittedRecordOrCollectRecordDataProperty: undefined,
}

export default RecordFormTitle
