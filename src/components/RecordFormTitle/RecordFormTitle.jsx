import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { getObjectById } from '../../library/getObjectById'
import { TooltipWithText, TooltipPopup } from '../generic/tooltip'
import { fishBeltPropType, sitePropType } from '../../App/mermaidData/mermaidDataProptypes'
import useDocumentTitle from '../../library/useDocumentTitle'
import { getProtocolTransectType } from '../../App/mermaidData/recordProtocolHelpers'
import { MuiTooltip } from '../generic/MuiTooltip'
import { IconButton } from '../generic/buttons'
import { IconGlobe } from '../icons'
import { useTranslation } from 'react-i18next'

const TitleContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  line-height: 1;
  white-space: nowrap;
  gap: 0 1rem;

  button {
    margin: 0;
    margin-top: 0.5rem;
  }

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

const BiggerIconGlobe = styled(IconGlobe)`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
`

const RecordFormTitle = ({
  submittedRecordOrCollectRecordDataProperty = undefined,
  sites,
  protocol,
}) => {
  const { t } = useTranslation()
  const transectType = getProtocolTransectType(protocol)
  const protocolTitle = t(`titles.${protocol}`) ?? ''
  const primaryTitle = `${protocolTitle}`
  const siteId = submittedRecordOrCollectRecordDataProperty.sample_event?.site
  const siteName = getObjectById(sites, siteId)?.name ?? ''
  const siteCoordinates = getObjectById(sites, siteId)?.location?.coordinates ?? []
  const transectNumber = submittedRecordOrCollectRecordDataProperty[transectType]?.number ?? ''
  const label = submittedRecordOrCollectRecordDataProperty[transectType]?.label ?? ''
  const sampleEventId = submittedRecordOrCollectRecordDataProperty.sample_event?.id ?? ''

  useDocumentTitle(
    `${primaryTitle && `${primaryTitle} `}${siteName} ${transectNumber} - ${t('titles.mermaid')}`,
  )

  const handleExploreButtonClick = () => {
    const [lng, lat] = siteCoordinates
    const queryParams = new URLSearchParams({ sample_event_id: sampleEventId })

    if (lat != null && lng != null) {
      queryParams.append('lat', lat)
      queryParams.append('lng', lng)
      queryParams.append('zoom', '15')
    }

    window.open(`${import.meta.env.VITE_MERMAID_EXPLORE_LINK}/?${queryParams.toString()}`, '_blank')
  }

  return (
    <TitleContainer id="collect-form-title" data-testid="edit-collect-record-form-title">
      {primaryTitle && (
        <ProjectTooltip
          forwardedAs="h2"
          text={primaryTitle}
          tooltipText="Protocol"
          id="protocol-tooltip"
        />
      )}
      {siteName && (
        <ProjectTooltip
          forwardedAs="h2"
          text={siteName}
          tooltipText="Site Name"
          id="site-name-tooltip"
        />
      )}
      {transectNumber && (
        <ProjectTooltip
          forwardedAs="h2"
          text={transectNumber}
          tooltipText="Transect Number"
          id="transect-number-tooltip"
        />
      )}
      {label && (
        <ProjectTooltip forwardedAs="h2" text={label} tooltipText="Label" id="label-tooltip" />
      )}
      {sampleEventId && (
        <MuiTooltip
          title={t('go_to_explore', { pageType: 'this sample event' })}
          placement="top"
          arrow
        >
          <IconButton
            type="button"
            aria-label={t('go_to_explore', { pageType: 'this sample event' })}
            onClick={handleExploreButtonClick}
          >
            <BiggerIconGlobe />
          </IconButton>
        </MuiTooltip>
      )}
    </TitleContainer>
  )
}

RecordFormTitle.propTypes = {
  submittedRecordOrCollectRecordDataProperty: fishBeltPropType,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  protocol: PropTypes.string.isRequired,
}

export default RecordFormTitle
