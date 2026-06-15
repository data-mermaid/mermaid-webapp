// Component borrowed from src/components/RecordFormTitle/RecordFormTitle.js
import React from 'react'
import { styled, css } from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../../../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../../../library/styling/mediaQueries'
import { useTranslation } from 'react-i18next'
import { MuiTooltip } from '../../../generic/MuiTooltip'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import { H2 } from '../../../generic/text'

const TooltipH2 = styled('h2')`
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  cursor: pointer;
  display: inline-block;
`

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
      <MuiTooltip title={t('title')} placement="bottom" arrow>
        <TooltipH2 tabIndex={0}>{indicatorSetTitle}</TooltipH2>
      </MuiTooltip>
      <MuiTooltip title={t('type')} placement="bottom" arrow>
        <TooltipH2 tabIndex={0}>{type}</TooltipH2>
      </MuiTooltip>
      <MuiTooltip title={t('gfcr.reporting_date_year')} placement="bottom" arrow>
        <TooltipH2 tabIndex={0}>{reportingYear}</TooltipH2>
      </MuiTooltip>
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
