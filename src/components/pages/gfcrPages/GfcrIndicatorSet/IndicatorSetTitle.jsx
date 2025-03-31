// Component borrowed from src/components/RecordFormTitle/RecordFormTitle.js
import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../../../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import { TooltipWithText, TooltipPopup } from '../../../generic/tooltip'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import language from '../../../../language'
import { H2 } from '../../../generic/text'

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

const IndicatorSetTitle = ({ indicatorSetTitle, type, reportingDate, isNew = false }) => {
  const reportingYear = reportingDate?.getFullYear()

  useDocumentTitle(
    isNew
      ? language.pages.gfcrIndicatorSet.title
      : `${indicatorSetTitle} ${type} ${reportingYear} - ${language.title.mermaid}`,
  )

  if (isNew) {
    return <H2>{language.pages.gfcrIndicatorSet.title}</H2>
  }

  return (
    <TitleContainer id="gfcr-indicator-set-form-title">
      <ProjectTooltip
        forwardedAs="h2"
        text={indicatorSetTitle}
        tooltipText="Title"
        id="gfcr-title-tooltip"
      />
      <ProjectTooltip forwardedAs="h2" text={type} tooltipText="Type" id="gfcr-type-tooltip" />
      <ProjectTooltip
        forwardedAs="h2"
        text={reportingYear}
        tooltipText="Reporting Date Year"
        id="gfcr-reporting-year-tooltip"
      />
    </TitleContainer>
  )
}

IndicatorSetTitle.propTypes = {
  indicatorSetTitle: PropTypes.string,
  type: PropTypes.string,
  reportingDate: PropTypes.instanceOf(Date),
  isNew: PropTypes.bool,
}

export default IndicatorSetTitle
