import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import {
  ActiveCollectRecordsCount,
  DataSharingPolicySubCardContent,
  OfflineSubCardContent,
  OfflineSummaryCard,
  OfflineMessage,
  OfflineSubCardGroupContent,
  SubCardGroupContent,
  SubCardContent,
  SubCardTitle,
  SummaryCardGroup,
  SummaryTitle,
  SummaryCard,
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

  const submittedCardOnline = (
    <SummaryCard to={`${projectUrl}/data`} aria-label="Data" onClick={stopEventPropagation}>
      <SubCardContent>
        <SubCardTitle>Submitted Sample Units</SubCardTitle>
        <div>
          <IconData />
          {num_sample_units}
        </div>
      </SubCardContent>
      <SummaryTitle>Submitted</SummaryTitle>
    </SummaryCard>
  )

  const submittedCardOffline = (
    <OfflineSummaryCard aria-label="Data Offline" onClick={stopEventPropagation}>
      <OfflineSubCardContent>
        <SubCardTitle>Submitted Sample Units</SubCardTitle>
        {offlineMessage}
      </OfflineSubCardContent>
      <SummaryTitle isDisabled={!isAppOnline}>Submitted</SummaryTitle>
    </OfflineSummaryCard>
  )

  const infoCardOnline = (
    <SummaryCard to={`${projectUrl}/admin`} aria-label="Admin" onClick={stopEventPropagation}>
      <SubCardGroupContent>
        <SubCardContent>
          <SubCardTitle>Sites</SubCardTitle>
          <div>
            <IconSites />
            {num_sites}
          </div>
        </SubCardContent>
        <SubCardContent>
          <SubCardTitle>Users</SubCardTitle>
          <div>
            <IconUsers />
            {members?.length || 0}
          </div>
        </SubCardContent>
        <DataSharingPolicySubCardContent>
          <SubCardTitle>Data sharing</SubCardTitle>
          <div>
            <span data-testid="fishbelt-policy">
              Fish belt: <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
            </span>
            <span data-testid="benthic-policy">
              Benthic: <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
            </span>
            <span data-testid="bleaching-policy">
              Bleaching: <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
            </span>
          </div>
        </DataSharingPolicySubCardContent>
      </SubCardGroupContent>
      <SummaryTitle>Info</SummaryTitle>
    </SummaryCard>
  )
  const infoCardOffline = (
    <OfflineSummaryCard aria-label="Admin Offline" onClick={stopEventPropagation}>
      <OfflineSubCardGroupContent>
        <SubCardTitle>Sites</SubCardTitle>
        <SubCardTitle>Users</SubCardTitle>
        <SubCardTitle>Data Sharing</SubCardTitle>
        {offlineMessage}
      </OfflineSubCardGroupContent>
      <SummaryTitle isDisabled={!isAppOnline}>Info</SummaryTitle>
    </OfflineSummaryCard>
  )

  return (
    <SummaryCardGroup>
      <SummaryCard
        to={`${projectUrl}/collecting`}
        aria-label="Collect"
        onClick={stopEventPropagation}
      >
        <SubCardContent>
          <SubCardTitle>Collecting Sample Units</SubCardTitle>
          <div data-testid="collect-counts">
            <IconCollect />
            {collectingSampleUnitCounts}
          </div>
        </SubCardContent>
        <SummaryTitle>Collecting</SummaryTitle>
      </SummaryCard>
      {isAppOnline ? submittedCardOnline : submittedCardOffline}
      {isAppOnline ? infoCardOnline : infoCardOffline}
    </SummaryCardGroup>
  )
}

ProjectCardSummary.propTypes = {
  project: projectPropType.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
}

export default ProjectCardSummary