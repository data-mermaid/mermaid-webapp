import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../theme'
import { mediaQueryTabletLandscapeOnly } from '../library/styling/mediaQueries'
import { getObjectById } from '../library/getObjectById'
import { TooltipWithText, TooltipPopup } from './generic/tooltip'
import { fishBeltPropType, sitePropType } from '../App/mermaidData/mermaidDataProptypes'
import useDocumentTitle from '../library/useDocumentTitle'
import { getProtocolTransectType } from '../App/mermaidData/recordProtocolHelpers'
import { MuiTooltip } from './generic/MuiTooltip'
import { BiggerIconGlobe } from './icons'
import { useTranslation } from 'react-i18next'
import { useCurrentProject } from '../App/CurrentProjectContext'
import buttonStyles from '../style/buttons.module.scss'

const TitleContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
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

const RecordFormTitle = ({
  submittedRecordOrCollectRecordDataProperty = undefined,
  sites,
  protocol,
}) => {
  const { t } = useTranslation()
  const transectType = getProtocolTransectType(protocol)
  const protocolTitle = t(`protocol_titles.${protocol}`)
  const siteId = submittedRecordOrCollectRecordDataProperty.sample_event?.site
  const siteName = getObjectById(sites, siteId)?.name ?? ''
  const siteCoordinates = getObjectById(sites, siteId)?.location?.coordinates ?? []
  const transectNumber = submittedRecordOrCollectRecordDataProperty[transectType]?.number ?? ''
  const label = submittedRecordOrCollectRecordDataProperty[transectType]?.label ?? ''
  const sampleEventId = submittedRecordOrCollectRecordDataProperty.sample_event?.id ?? ''
  const { currentProject } = useCurrentProject()
  const isDemoProject = currentProject?.is_demo

  useDocumentTitle(`${protocolTitle} ${siteName} ${transectNumber} - ${t('mermaid')}`)

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
  const exploreTooltipText = isDemoProject
    ? 'projects.demo.sample_explore_unavailable'
    : 'go_to_explore_sample_event'

  return (
    <TitleContainer id="collect-form-title" data-testid="record-form-title">
      {protocolTitle && (
        <ProjectTooltip
          forwardedAs="h2"
          text={protocolTitle}
          tooltipText={t('sample_units.protocol')}
          id="protocol-tooltip"
          data-testid="protocol-tooltip"
        />
      )}
      {siteName && (
        <ProjectTooltip
          forwardedAs="h2"
          text={siteName}
          tooltipText={t('sites.site_name')}
          id="site-name-tooltip"
        />
      )}
      {transectNumber && (
        <ProjectTooltip
          forwardedAs="h2"
          text={transectNumber}
          tooltipText={t('sample_units.transect_number')}
          id="transect-number-tooltip"
        />
      )}
      {label && (
        <ProjectTooltip forwardedAs="h2" text={label} tooltipText={t('label')} id="label-tooltip" />
      )}
      {sampleEventId && (
        <MuiTooltip title={t(exploreTooltipText)} placement="top" arrow>
          <span role="presentation">
            <button
              className={buttonStyles['button--icon']}
              type="button"
              aria-label={t(exploreTooltipText)}
              onClick={handleExploreButtonClick}
              disabled={isDemoProject}
            >
              <BiggerIconGlobe />
            </button>
          </span>
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
