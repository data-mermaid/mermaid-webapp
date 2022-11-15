import React from 'react'
import Collect from '../components/pages/Collect'
import DataSharing from '../components/pages/DataSharing'
import FishFamilies from '../components/pages/FishFamilies'
import GraphsAndMaps from '../components/pages/GraphsAndMaps'
import ManagementRegimes from '../components/pages/ManagementRegimes'
import ManagementRegime from '../components/pages/ManagementRegime'
import ProjectInfo from '../components/pages/ProjectInfo'
import Projects from '../components/pages/Projects'
import Sites from '../components/pages/Sites'
import Site from '../components/pages/Site'
import Submitted from '../components/pages/Submitted'
import Users from '../components/pages/Users'
import UsersAndTransects from '../components/pages/UsersAndTransects'
import ManagementRegimesOverview from '../components/pages/ManagementRegimesOverview'
import FishBeltForm from '../components/pages/collectRecordFormPages/FishBeltForm'
import SubmittedFishBelt from '../components/pages/submittedRecordPages/SubmittedFishBelt/SubmittedFishBelt'
import BenthicPhotoQuadratForm from '../components/pages/collectRecordFormPages/BenthicPhotoQuadratForm'
import SubmittedBenthicPhotoQuadrat from '../components/pages/submittedRecordPages/SubmittedBenthicPhotoQuadrat'
import SubmittedBenthicPit from '../components/pages/submittedRecordPages/SubmittedBenthicPit/SubmittedBenthicPit'
import BenthicPitForm from '../components/pages/collectRecordFormPages/BenthicPitForm/BenthicPitForm'
import BleachingForm from '../components/pages/collectRecordFormPages/BleachingForm/BleachingForm'
import HabitatComplexityForm from '../components/pages/collectRecordFormPages/HabitatComplexityForm/HabitatComplexityForm'
import BenthicLITForm from '../components/pages/collectRecordFormPages/BenthicLitForm/BenthicLitForm'

export const useRoutes = ({ apiSyncInstance }) => {
  const routes = [
    {
      path: '/projects',
      Component: () => <Projects apiSyncInstance={apiSyncInstance} />,
    },
    {
      path: '/projects/:projectId/users-and-transects',
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
      path: '/projects/:projectId/collecting/benthic-photo-quadrat',
      Component: () => <BenthicPhotoQuadratForm isNewRecord={true} />,
    },
    {
      path: '/projects/:projectId/collecting/benthic-photo-quadrat/:recordId',
      Component: () => <BenthicPhotoQuadratForm isNewRecord={false} />,
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/',
      Component: () => <BenthicLITForm />,
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/:recordId',
      Component: () => <> Placeholder edit benthic LIT collect record page </>,
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
      Component: () => <HabitatComplexityForm />,
    },
    {
      path: '/projects/:projectId/collecting/bleaching/',
      Component: () => <BleachingForm />,
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
  ]

  return { routes }
}
