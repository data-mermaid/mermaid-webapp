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
  const offlineMessage = (
    <OfflineOrReadOnlyContent>{t('project_card.online_only')}</OfflineOrReadOnlyContent>
  )

  const readOnlyUserCollectCardContent =
    userCollectCount > 0 ? (
      <OfflineOrReadOnlyContent smallFont>
        {t('collect_record.readonly_user_with_active_sample_units')}
      </OfflineOrReadOnlyContent>
    ) : (
      <OfflineOrReadOnlyContent>{t('project_card.read_only')}</OfflineOrReadOnlyContent>
    )

  const collectingCard = (
    <SummaryCard
      to={`${projectUrl}/collecting`}
      aria-label="Collect"
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('project_card.collecting')}</SubCardTitle>
      <SubCardIconAndCount data-testid="collect-counts">
        <IconCollect />
        <>{collectCardContent}</>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const readOnlyCollectingCard = (
    <OfflineSummaryCard aria-label="Collect" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.collecting')}</SubCardTitle>
      {readOnlyUserCollectCardContent}
    </OfflineSummaryCard>
  )

  const submittedCardOnline = (
    <SummaryCard
      to={`${projectUrl}/submitted`}
      aria-label="Submitted"
      onClick={stopEventPropagation}
    >
      <SubCardTitle>{t('project_card.submitted')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconData />
        <span>{num_sample_units}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const sitesCardOnline = (
    <SummaryCard to={`${projectUrl}/sites`} aria-label="Sites" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.sites')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconSites />
        <span>{num_sites}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const usersCardOnline = (
    <SummaryCard to={`${projectUrl}/users`} aria-label="Users" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.users')}</SubCardTitle>
      <SubCardIconAndCount>
        <IconUsers />
        <span>{members?.length || 0}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const dataSharingCardOnline = (
    <DataSharingSummaryCard
      to={`${projectUrl}/data-sharing`}
      aria-label="Data-Sharing"
      onClick={stopEventPropagation}
    >
      <div>
        <SubCardTitle>{t('project_card.data_sharing')}</SubCardTitle>
        <DataSharingList>
          <li data-testid="fishbelt-policy">
            {t('project_card.fish_belt_label')}{' '}
            <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
          </li>
          <li data-testid="benthic-policy">
            {t('project_card.benthic_label')}{' '}
            <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
          </li>
          <li data-testid="bleaching-policy">
            {t('project_card.bleaching_label')}{' '}
            <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
          </li>
        </DataSharingList>
      </div>
    </DataSharingSummaryCard>
  )

  const submittedCardOffline = (
    <OfflineSummaryCard aria-label="Submitted Offline" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.submitted')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const sitesCardOffline = (
    <OfflineSummaryCard aria-label="Sites Offline" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.sites')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const usersCardOffline = (
    <OfflineSummaryCard aria-label="Users Offline" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.users')}</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const dataSharingCardOffline = (
    <OfflineSummaryCard aria-label="Data-sharing Offline" onClick={stopEventPropagation}>
      <SubCardTitle>{t('project_card.data_sharing')}</SubCardTitle>
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
