import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import {
  ActiveCollectRecordsCount,
  OfflineSummaryCard,
  OfflineOrReadOnlyContent,
  SubCardIconAndCount,
  SubCardTitle,
  DataSharingSummaryCard,
  SummaryCardGroup,
  SummaryCard,
  DataSharingList,
} from './ProjectCard.styles'
import { getDataSharingPolicyLabel } from '../../library/getDataSharingPolicyLabel'
import { IconCollect, IconData, IconSites, IconUsers } from '../icons'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import stopEventPropagation from '../../library/stopEventPropagation'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { getIsUserReadOnlyForProject } from '../../App/currentUserProfileHelpers'
import language from '../../language'
import { useTranslation } from 'react-i18next'

const ProjectCardSummary = ({ project, isAppOnline }) => {
  const { t } = useTranslation()
  const { currentUser } = useCurrentUser()
  const {
    num_active_sample_units,
    num_sites,
    num_sample_units,
    members,
    data_policy_beltfish,
    data_policy_benthiclit,
    data_policy_bleachingqc,
    id,
  } = project

  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, id)
  const projectUrl = `/projects/${id}`

  const userCollectCount = useMemo(() => {
    return (
      currentUser?.projects?.find(({ id: idToCheck }) => idToCheck === id)
        ?.num_active_sample_units || 0
    )
  }, [currentUser, id])

  const collectCardContent =
    userCollectCount > 0 ? (
      <>
        {num_active_sample_units} /{' '}
        <ActiveCollectRecordsCount>{userCollectCount}</ActiveCollectRecordsCount>
      </>
    ) : (
      <>{num_active_sample_units} </>
    )
  const offlineMessage = <OfflineOrReadOnlyContent>{t('status.online_only')}</OfflineOrReadOnlyContent>

  const readOnlyUserCollectCardContent =
    userCollectCount > 0 ? (
      <OfflineOrReadOnlyContent smallFont>
        {language.pages.projectsList.readOnlyUserWithActiveSampleUnits}
      </OfflineOrReadOnlyContent>
    ) : (
      <OfflineOrReadOnlyContent>{t('status.read_only')}</OfflineOrReadOnlyContent>
    )

  const collectingCard = (
    <SummaryCard
      to={`${projectUrl}/collecting`}
      aria-label={t('aria.collect')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('cards.collecting')}</SubCardTitle>
      <SubCardIconAndCount data-testid="collect-counts">
        <IconCollect />
        <>{collectCardContent}</>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const readOnlyCollectingCard = (
    <OfflineSummaryCard aria-label={t('aria.collect')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.collecting')}</SubCardTitle>
      {readOnlyUserCollectCardContent}
    </OfflineSummaryCard>
  )

  const submittedCardOnline = (
    <SummaryCard
      to={`${projectUrl}/submitted`}
      aria-label={t('aria.submitted')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('cards.submitted')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconData />
        <span>{num_sample_units}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const sitesCardOnline = (
    <SummaryCard to={`${projectUrl}/sites`} aria-label={t('aria.sites')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.sites')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconSites />
        <span>{num_sites}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const usersCardOnline = (
    <SummaryCard to={`${projectUrl}/users`} aria-label={t('aria.users')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.users')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconUsers />
        <span>{members?.length || 0}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const dataSharingCardOnline = (
    <DataSharingSummaryCard
      to={`${projectUrl}/data-sharing`}
      aria-label={t('aria.data_sharing')}
      onClick={stopEventPropagation}
    >
      <div>
        <SubCardTitle>{t('cards.data_sharing')}</SubCardTitle>
        <DataSharingList>
          <li data-testid="fishbelt-policy">
            {t('labels.fish_belt')} <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
          </li>
          <li data-testid="benthic-policy">
            {t('labels.benthic')} <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
          </li>
          <li data-testid="bleaching-policy">
            {t('labels.bleaching')} <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
          </li>
        </DataSharingList>
      </div>
    </DataSharingSummaryCard>
  )

  const submittedCardOffline = (
    <OfflineSummaryCard aria-label={t('aria.submitted')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.submitted')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const sitesCardOffline = (
    <OfflineSummaryCard aria-label={t('aria.sites')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.sites')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const usersCardOffline = (
    <OfflineSummaryCard aria-label={t('aria.users')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.users')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const dataSharingCardOffline = (
    <OfflineSummaryCard aria-label={t('aria.data_sharing')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('cards.data_sharing')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  return (
    <SummaryCardGroup>
      {isReadOnlyUser ? readOnlyCollectingCard : collectingCard}
      {isAppOnline ? submittedCardOnline : submittedCardOffline}
      {isAppOnline || !isReadOnlyUser ? sitesCardOnline : sitesCardOffline}
      {isAppOnline ? usersCardOnline : usersCardOffline}
      {isAppOnline ? dataSharingCardOnline : dataSharingCardOffline}
    </SummaryCardGroup>
  )
}

ProjectCardSummary.propTypes = {
  project: projectPropType.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
}

export default ProjectCardSummary
