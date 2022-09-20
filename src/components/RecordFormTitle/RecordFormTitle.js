import React from 'react'
import styled, { css } from 'styled-components/macro'
import PropTypes from 'prop-types'
import theme from '../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { getObjectById } from '../../library/getObjectById'
import { TooltipWithText, TooltipPopup } from '../generic/tooltip'
import { fishBeltPropType, sitePropType } from '../../App/mermaidData/mermaidDataProptypes'
import useDocumentTitle from '../../library/useDocumentTitle'
import language from '../../language'

const TitleContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  line-height: 1;
  white-space: nowrap;
  gap: 0 1rem;
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: ${theme.typography.smallFontSize};
    h2 {
      margin-block: ${theme.spacing.small};
    }
  `)}
`
const ProjectTooltip = styled(TooltipWithText)`
  ${TooltipPopup} {
    width: auto;
    min-width: max-content;
    text-align: center;
  }
`
const RecordFormTitle = ({ submittedRecordOrCollectRecordDataProperty, sites, sampleUnit }) => {
  const primaryTitle =
    sampleUnit === 'fishbelt_transect'
      ? `${language.pages.collectRecord.title} - ${language.pages.fishBeltForm.title}`
      : `${language.pages.collectRecord.title} - ${language.pages.benthicPhotoQuadratForm.title}`
  const siteId = submittedRecordOrCollectRecordDataProperty.sample_event?.site
  const siteName = getObjectById(sites, siteId)?.name ?? ''
  const transectNumber = submittedRecordOrCollectRecordDataProperty[sampleUnit]?.number ?? ''
  const label = submittedRecordOrCollectRecordDataProperty[sampleUnit]?.label ?? ''

  useDocumentTitle(
    `${primaryTitle && `${primaryTitle} `}${siteName} ${transectNumber} - ${
      language.title.mermaid
    }`,
  )

  return (
    <TitleContainer id="collect-form-title" data-testid="edit-collect-record-form-title">
      <ProjectTooltip
        forwardedAs="h2"
        text={primaryTitle}
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
  sampleUnit: PropTypes.string.isRequired,
}

RecordFormTitle.defaultProps = {
  submittedRecordOrCollectRecordDataProperty: undefined,
}

export default RecordFormTitle
