import React from 'react'

import BenthicLitForm from '../components/pages/collectRecordFormPages/BenthicLitForm/BenthicLitForm'
import BenthicPhotoQuadratForm from '../components/pages/collectRecordFormPages/BenthicPhotoQuadratForm'
import BenthicPitForm from '../components/pages/collectRecordFormPages/BenthicPitForm/BenthicPitForm'
import BleachingForm from '../components/pages/collectRecordFormPages/BleachingForm/BleachingForm'
import Collect from '../components/pages/Collect'
import DataSharing from '../components/pages/DataSharing'
import FishBeltForm from '../components/pages/collectRecordFormPages/FishBeltForm'
import FishFamilies from '../components/pages/FishFamilies'
import Gfcr from '../components/pages/gfcrPages/Gfcr'
import GfcrIndicatorSet from '../components/pages/gfcrPages/GfcrIndicatorSet'
import GraphsAndMaps from '../components/pages/GraphsAndMaps'
import HabitatComplexityForm from '../components/pages/collectRecordFormPages/HabitatComplexityForm/HabitatComplexityForm'
import ManagementRegime from '../components/pages/ManagementRegime'
import ManagementRegimes from '../components/pages/ManagementRegimes'
import ManagementRegimesOverview from '../components/pages/ManagementRegimesOverview'
import ProjectInfo from '../components/pages/ProjectInfo'
import Projects from '../components/pages/Projects'
import Site from '../components/pages/Site'
import Sites from '../components/pages/Sites'
import Submitted from '../components/pages/Submitted'
import SubmittedBenthicLit from '../components/pages/submittedRecordPages/SubmittedBenthicLit/SubmittedBenthicLit'
import SubmittedBenthicPhotoQuadrat from '../components/pages/submittedRecordPages/SubmittedBenthicPhotoQuadrat'
import SubmittedBenthicPit from '../components/pages/submittedRecordPages/SubmittedBenthicPit/SubmittedBenthicPit'
import SubmittedBleaching from '../components/pages/submittedRecordPages/SubmittedBleaching/SubmittedBleaching'
import SubmittedFishBelt from '../components/pages/submittedRecordPages/SubmittedFishBelt/SubmittedFishBelt'
import SubmittedHabitatComplexity from '../components/pages/submittedRecordPages/SubmittedHabitatComplexity/SubmittedHabitatComplexity'
import UserDoesntHaveProjectAccess from '../components/pages/UserDoesntHaveProjectAccess'
import Users from '../components/pages/Users'
import UsersAndTransects from '../components/pages/UsersAndTransects'

export const routes = [
  {
    path: '/projects',
    Component: () => <Projects />,
  },
  {
    path: '/projects/:projectId/observers-and-transects',
    Component: UsersAndTransects,
  },
  {
    path: '/projects/:projectId/management-regimes-overview',
    Component: ManagementRegimesOverview,
  },
  {
    path: '/projects/:projectId/collecting',
    Component: Collect,
  },
  {
    path: '/projects/:projectId/collecting/fishbelt',
    Component: () => <FishBeltForm isNewRecord={true} />,
  },
  {
    path: '/projects/:projectId/collecting/fishbelt/:recordId',
    Component: () => <FishBeltForm isNewRecord={false} />,
  },
  {
    path: '/projects/:projectId/collecting/benthicpqt',
    Component: () => <BenthicPhotoQuadratForm isNewRecord={true} />,
  },
  {
    path: '/projects/:projectId/collecting/benthicpqt/:recordId',
    Component: () => <BenthicPhotoQuadratForm isNewRecord={false} />,
  },
  {
    path: '/projects/:projectId/collecting/benthiclit/',
    Component: () => <BenthicLitForm isNewRecord={true} />,
  },
  {
    path: '/projects/:projectId/collecting/benthiclit/:recordId',
    Component: () => <BenthicLitForm isNewRecord={false} />,
  },
  {
    path: '/projects/:projectId/collecting/benthicpit/',
    Component: () => <BenthicPitForm isNewRecord={true} />,
  },
  {
    path: '/projects/:projectId/collecting/benthicpit/:recordId',
    Component: () => <BenthicPitForm isNewRecord={false} />,
  },
  {
    path: '/projects/:projectId/collecting/habitatcomplexity/',
    Component: () => <HabitatComplexityForm isNewRecord={true} />,
  },
  {
    path: '/projects/:projectId/collecting/habitatcomplexity/:recordId',
    Component: () => <HabitatComplexityForm isNewRecord={false} />,
  },
  {
    path: '/projects/:projectId/collecting/bleachingqc/',
    Component: () => <BleachingForm isNewRecord={true} />,
  },
  {
    path: '/projects/:projectId/collecting/bleachingqc/:recordId',
    Component: () => <BleachingForm isNewRecord={false} />,
  },
  {
    path: '/projects/:projectId/submitted',
    Component: Submitted,
  },
  {
    path: '/projects/:projectId/submitted/fishbelt/:submittedRecordId',
    Component: () => <SubmittedFishBelt />,
  },
  {
    path: '/projects/:projectId/submitted/benthicpqt/:submittedRecordId',
    Component: () => <SubmittedBenthicPhotoQuadrat />,
  },
  {
    path: '/projects/:projectId/submitted/benthicpit/:submittedRecordId',
    Component: () => <SubmittedBenthicPit />,
  },
  {
    path: '/projects/:projectId/submitted/bleachingqc/:submittedRecordId',
    Component: () => <SubmittedBleaching />,
  },
  {
    path: '/projects/:projectId/submitted/habitatcomplexity/:submittedRecordId',
    Component: () => <SubmittedHabitatComplexity />,
  },
  {
    path: '/projects/:projectId/submitted/benthiclit/:submittedRecordId',
    Component: () => <SubmittedBenthicLit />,
  },
  {
    path: '/projects/:projectId/project-info',
    Component: () => <ProjectInfo />,
  },

  {
    path: '/projects/:projectId/graphs-and-maps',
    Component: GraphsAndMaps,
  },

  {
    path: '/projects/:projectId/sites',
    Component: Sites,
  },
  {
    path: '/projects/:projectId/sites/new',
    Component: () => <Site isNewSite={true} />,
  },
  {
    path: '/projects/:projectId/sites/:siteId',
    Component: () => <Site isNewSite={false} />,
  },
  {
    path: '/projects/:projectId/management-regimes',
    Component: ManagementRegimes,
  },
  {
    path: '/projects/:projectId/management-regimes/new',
    Component: () => <ManagementRegime isNewManagementRegime={true} />,
  },
  {
    path: '/projects/:projectId/management-regimes/:managementRegimeId',
    Component: () => <ManagementRegime isNewManagementRegime={false} />,
  },
  {
    path: '/projects/:projectId/users',
    Component: () => <Users />,
  },
  {
    path: '/projects/:projectId/fish-families',
    Component: FishFamilies,
  },
  {
    path: '/projects/:projectId/data-sharing',
    Component: () => <DataSharing />,
  },
  {
    path: '/projects/:projectId/gfcr',
    Component: () => <Gfcr />,
  },
  {
    path: '/projects/:projectId/gfcr/new/report',
    Component: () => <GfcrIndicatorSet newIndicatorSetType={'report'} />,
  },
  {
    path: '/projects/:projectId/gfcr/new/target',
    Component: () => <GfcrIndicatorSet newIndicatorSetType={'target'} />,
  },
  {
    path: '/projects/:projectId/gfcr/:indicatorSetId',
    Component: () => <GfcrIndicatorSet />,
  },
  {
    path: '/noProjectAccess',
    Component: UserDoesntHaveProjectAccess,
  },
  {
    path: '/noProjectAccess/:projectName',
    Component: UserDoesntHaveProjectAccess,
  },
]
