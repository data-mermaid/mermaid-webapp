// Component borrowed from src/components/RecordFormTitle/RecordFormTitle.js
import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import { TooltipWithText, TooltipPopup } from '../../../generic/tooltip'
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

  useDocumentTitle(
    isNew
      ? t('gfcr_indicator_set.title')
      : `${indicatorSetTitle} ${type} ${reportingYear} - ${t('app_title')}`,
  )

  if (isNew) {
    return <H2>{t('gfcr_indicator_set.title')}</H2>
  }

  return (
    <TitleContainer id="gfcr-indicator-set-form-title">
      <ProjectTooltip
        forwardedAs="h2"
        text={indicatorSetTitle}
        tooltipText={t('gfcr.indicator_set_title_tooltip.title')}
        id="gfcr-title-tooltip"
      />
      <ProjectTooltip
        forwardedAs="h2"
        text={type}
        tooltipText={t('gfcr.indicator_set_title_tooltip.type')}
        id="gfcr-type-tooltip"
      />
      <ProjectTooltip
        forwardedAs="h2"
        text={reportingYear}
        tooltipText={t('gfcr.indicator_set_title_tooltip.reporting_year')}
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
