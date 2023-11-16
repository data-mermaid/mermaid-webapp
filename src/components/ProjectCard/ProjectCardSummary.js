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

const ProjectCardSummary = ({ project, isAppOnline }) => {
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
  const offlineMessage = <OfflineOrReadOnlyContent>Online Only</OfflineOrReadOnlyContent>

  const readOnlyUserCollectCardContent =
    userCollectCount > 0 ? (
      <OfflineOrReadOnlyContent smallFont>
        {language.pages.projectsList.readOnlyUserWithActiveSampleUnits}
      </OfflineOrReadOnlyContent>
    ) : (
      <OfflineOrReadOnlyContent>Read Only</OfflineOrReadOnlyContent>
    )

  const collectingCard = (
    <SummaryCard
      to={`${projectUrl}/collecting`}
      aria-label="Collect"
      onClick={stopEventPropagation}
    >
      <SubCardTitle>Collecting</SubCardTitle>
      <SubCardIconAndCount data-testid="collect-counts">
        <IconCollect />
        <>{collectCardContent}</>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const readOnlyCollectingCard = (
    <OfflineSummaryCard aria-label="Collect" onClick={stopEventPropagation}>
      <SubCardTitle>Collecting</SubCardTitle>
      {readOnlyUserCollectCardContent}
    </OfflineSummaryCard>
  )

  const submittedCardOnline = (
    <SummaryCard
      to={`${projectUrl}/submitted`}
      aria-label="Submitted"
      onClick={stopEventPropagation}
    >
      <SubCardTitle>Submitted</SubCardTitle>
      <SubCardIconAndCount>
        <IconData />
        <span>{num_sample_units}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const sitesCardOnline = (
    <SummaryCard to={`${projectUrl}/sites`} aria-label="Sites" onClick={stopEventPropagation}>
      <SubCardTitle>Sites</SubCardTitle>
      <SubCardIconAndCount>
        <IconSites />
        <span>{num_sites}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )

  const usersCardOnline = (
    <SummaryCard to={`${projectUrl}/users`} aria-label="Users" onClick={stopEventPropagation}>
      <SubCardTitle>Users</SubCardTitle>
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
        <SubCardTitle>Data sharing</SubCardTitle>
        <DataSharingList>
          <li data-testid="fishbelt-policy">
            Fish belt: <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
          </li>
          <li data-testid="benthic-policy">
            Benthic: <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
          </li>
          <li data-testid="bleaching-policy">
            Bleaching: <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
          </li>
        </DataSharingList>
      </div>
    </DataSharingSummaryCard>
  )

  const submittedCardOffline = (
    <OfflineSummaryCard aria-label="Submitted Offline" onClick={stopEventPropagation}>
      <SubCardTitle>Submitted</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const sitesCardOffline = (
    <OfflineSummaryCard aria-label="Sites Offline" onClick={stopEventPropagation}>
      <SubCardTitle>Sites</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const usersCardOffline = (
    <OfflineSummaryCard aria-label="Users Offline" onClick={stopEventPropagation}>
      <SubCardTitle>Users</SubCardTitle>
      {offlineMessage}
    </OfflineSummaryCard>
  )

  const dataSharingCardOffline = (
    <OfflineSummaryCard aria-label="Data-sharing Offline" onClick={stopEventPropagation}>
      <SubCardTitle>Data Sharing</SubCardTitle>
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
