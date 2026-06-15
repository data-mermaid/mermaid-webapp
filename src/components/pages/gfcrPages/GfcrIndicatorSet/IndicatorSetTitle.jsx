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
      <MuiTooltip title={t('title')} placement="top" arrow>
        <h2>{indicatorSetTitle}</h2>
      </MuiTooltip>
      <MuiTooltip title={t('type')} placement="top" arrow>
        <h2>{type}</h2>
      </MuiTooltip>
      <MuiTooltip title={t('gfcr.reporting_date_year')} placement="top" arrow>
        <h2>{reportingYear}</h2>
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
