import React from 'react'

import {
  DataSharingPolicySubCardContent,
  SubCardContents,
  SubCardContent,
  SubCardTitle,
  SummaryCardGroups,
  SummaryTitle,
  SummaryCardWrapper,
} from './ProjectCard.styles'
import { getDataSharingPolicyLabel } from '../../library/getDataSharingPolicyLabel'
import { IconCollect, IconData, IconSites, IconUsers } from '../icons'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import stopEventPropagation from '../../library/stopEventPropagation'

const ProjectCardSummary = ({ project }) => {
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

  return (
    <SummaryCardGroups>
      <SummaryCardWrapper to={`${projectUrl}/collecting`} onClick={stopEventPropagation}>
        <SubCardContent>
          <SubCardTitle>Collecting Sample Units</SubCardTitle>
          <div>
            <IconCollect />
            {num_active_sample_units}
          </div>
        </SubCardContent>
        <SummaryTitle>Collecting</SummaryTitle>
      </SummaryCardWrapper>
      <SummaryCardWrapper to={`${projectUrl}/data`} onClick={stopEventPropagation}>
        <SubCardContent>
          <SubCardTitle>Submitted Sample Units</SubCardTitle>
          <div>
            <IconData />
            {num_sample_units}
          </div>
        </SubCardContent>
        <SummaryTitle>Submitted</SummaryTitle>
      </SummaryCardWrapper>
      <SummaryCardWrapper to={`${projectUrl}/admin`} onClick={stopEventPropagation}>
        <SubCardContents>
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
              <span>
                Fish belt: <strong>{getDataSharingPolicyLabel(data_policy_beltfish)}</strong>
              </span>
              <span>
                Benthic: <strong>{getDataSharingPolicyLabel(data_policy_benthiclit)}</strong>
              </span>
              <span>
                Bleaching: <strong>{getDataSharingPolicyLabel(data_policy_bleachingqc)}</strong>
              </span>
            </div>
          </DataSharingPolicySubCardContent>
        </SubCardContents>
        <SummaryTitle>Info</SummaryTitle>
      </SummaryCardWrapper>
    </SummaryCardGroups>
  )
}

ProjectCardSummary.propTypes = {
  project: projectPropType.isRequired,
}

export default ProjectCardSummary
