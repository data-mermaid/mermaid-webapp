import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

const ProjectCardSummary = ({ project, isAppOnline }) => {
  const { currentUser } = useCurrentUser()
  const { t } = useTranslation()
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
  const offlineMessage = (
    <OfflineOrReadOnlyContent>{t('projects.online_only')}</OfflineOrReadOnlyContent>
  )

  const readOnlyUserCollectCardContent =
    userCollectCount > 0 ? (
      <OfflineOrReadOnlyContent smallFont>
        {t('projects.warning_readonly_active_units')}
      </OfflineOrReadOnlyContent>
    ) : (
      <OfflineOrReadOnlyContent>{t('projects.read_only')}</OfflineOrReadOnlyContent>
    )

  const collectingCard = (
    <SummaryCard
      to={`${projectUrl}/collecting`}
      aria-label={t('sample_units.collect')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('sample_units.collecting')}</SubCardTitle>
      <SubCardIconAndCount data-testid="collect-counts">
        <IconCollect />
        <>{collectCardContent}</>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const readOnlyCollectingCard = (
    <OfflineSummaryCard aria-label={t('sample_units.collect')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('sample_units.collecting')}</SubCardTitle>
      {readOnlyUserCollectCardContent}
    </OfflineSummaryCard>
  )

  const submittedCardOnline = (
    <SummaryCard
      to={`${projectUrl}/submitted`}
      aria-label={t('sample_units.submitted')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('sample_units.submitted')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconData />
        <span>{num_sample_units}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const sitesCardOnline = (
    <SummaryCard
      to={`${projectUrl}/sites`}
      aria-label={t('sites.sites')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('sites.sites')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconSites />
        <span>{num_sites}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const usersCardOnline = (
    <SummaryCard
      to={`${projectUrl}/users`}
      aria-label={t('users.users')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('users.users')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconUsers />
        <span>{members?.length || 0}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const dataSharingCardOnline = (
    <DataSharingSummaryCard
      to={`${projectUrl}/data-sharing`}
      aria-label={t('data_sharing.data_sharing')}
      onClick={stopEventPropagation}
    >
      <div>
        <SubCardTitle>{t('data_sharing.data_sharing')}</SubCardTitle>
        <DataSharingList>
          <li data-testid="fishbelt-policy">
            {t('protocol_titles.fishbelt')}:{' '}
            <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
          </li>
          <li data-testid="benthic-policy">
            {t('protocol_titles.benthiclit')}:{' '}
            <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
          </li>
          <li data-testid="bleaching-policy">
            {t('protocol_titles.bleachingqc')}:{' '}
            <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
          </li>
        </DataSharingList>
      </div>
    </DataSharingSummaryCard>
  )

  const submittedCardOffline = (
    <OfflineSummaryCard
      aria-label={t('sample_units.submitted_offline')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('sample_units.submitted')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const sitesCardOffline = (
    <OfflineSummaryCard aria-label={t('sites.sites_offline')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('sites.sites')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const usersCardOffline = (
    <OfflineSummaryCard aria-label={t('users.users_offline')} onClick={stopEventPropagation}>
      <SubCardTitle>{t('users.users')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const dataSharingCardOffline = (
    <OfflineSummaryCard
      aria-label={t('data_sharing.data_sharing_offline')}
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('data_sharing.data_sharing')}</SubCardTitle>
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
