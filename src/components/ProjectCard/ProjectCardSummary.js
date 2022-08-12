import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import {
  ActiveCollectRecordsCount,
  OfflineSummaryCard,
  OfflineMessage,
  SubCardIconAndCount,
  SubCardTitle,
  SummaryCardGroup,
  SummaryCard,
  DataSharingPolicySubCardContent,
} from './ProjectCard.styles'
import { getDataSharingPolicyLabel } from '../../library/getDataSharingPolicyLabel'
import { IconCollect, IconData, IconSites, IconUsers } from '../icons'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import stopEventPropagation from '../../library/stopEventPropagation'
import { useCurrentUser } from '../../App/CurrentUserContext'

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

  const projectUrl = `projects/${id}`
  const getCurrentNumberActiveSampleUnits = useCallback(
    (projectId) => {
      return (
        currentUser?.projects?.find(({ id: idToCheck }) => idToCheck === projectId)
          ?.num_active_sample_units || 0
      )
    },
    [currentUser],
  )

  const userCollectCount = getCurrentNumberActiveSampleUnits(id)
  const collectingSampleUnitCounts =
    userCollectCount > 0 ? (
      <>
        {num_active_sample_units} /{' '}
        <ActiveCollectRecordsCount>{userCollectCount}</ActiveCollectRecordsCount>
      </>
    ) : (
      <>{num_active_sample_units} </>
    )
  const offlineMessage = <OfflineMessage>Online Only</OfflineMessage>

  // Online cards
  const collectingCardOnline = (
    <SummaryCard
      to={`${projectUrl}/collecting`}
      aria-label="Collect"
      onClick={stopEventPropagation}
    >
      <SubCardTitle>Collecting</SubCardTitle>
      <SubCardIconAndCount data-testid="collect-counts">
        <IconCollect />
        <span>{collectingSampleUnitCounts}</span>
      </SubCardIconAndCount>
    </SummaryCard>
  )
  const submittedCardOnline = (
    <SummaryCard to={`${projectUrl}/data`} aria-label="Data" onClick={stopEventPropagation}>
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
    <SummaryCard
      to={`${projectUrl}/data-sharing`}
      aria-label="Data Sharing"
      onClick={stopEventPropagation}
    >
      <SubCardTitle>Data sharing</SubCardTitle>
      <DataSharingPolicySubCardContent>
        <span data-testid="fishbelt-policy">
          Fish belt: <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
        </span>
        <span data-testid="benthic-policy">
          Benthic: <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
        </span>
        <span data-testid="bleaching-policy">
          Bleaching: <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
        </span>
      </DataSharingPolicySubCardContent>
    </SummaryCard>
  )
  // Offline cards
  const submittedCardOffline = (
    <OfflineSummaryCard aria-label="Data Offline" onClick={stopEventPropagation}>
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
      {collectingCardOnline}
      {isAppOnline ? submittedCardOnline : submittedCardOffline}
      {isAppOnline ? sitesCardOnline : sitesCardOffline}
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
