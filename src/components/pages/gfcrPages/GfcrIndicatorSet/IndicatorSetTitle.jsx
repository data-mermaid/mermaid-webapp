// Component borrowed from src/components/RecordFormTitle/RecordFormTitle.js
import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../../../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import { TooltipWithText, TooltipPopup } from '../../../generic/tooltip'
import { useTranslation } from 'react-i18next'
import useDocumentTitle from '../../../../library/useDocumentTitle'
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
  const { t } = useTranslation()
  const reportingYear = reportingDate?.getFullYear()
  const indicatorSetTitleText = t('gfcr.indicator_set')

  useDocumentTitle(
    isNew
      ? indicatorSetTitleText
      : `${indicatorSetTitle} ${type} ${reportingYear} - ${t('mermaid')}`,
  )

  if (isNew) {
    return <H2>{indicatorSetTitleText}</H2>
  }

  return (
    <TitleContainer id="gfcr-indicator-set-form-title">
      <ProjectTooltip
        forwardedAs="h2"
        text={indicatorSetTitle}
        tooltipText={t('title')}
        id="gfcr-title-tooltip"
      />
      <ProjectTooltip forwardedAs="h2" text={type} tooltipText={t('type')} id="gfcr-type-tooltip" />
      <ProjectTooltip
        forwardedAs="h2"
        text={reportingYear}
        tooltipText={t('gfcr.reporting_date_year')}
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
