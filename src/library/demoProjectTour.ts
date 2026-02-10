import { DriveStep } from 'driver.js'
import i18next from 'i18next'

const stepTranslations = [
  i18next.t('projects.tour.intro_tagline'),
  i18next.t('projects.tour.intro'),
]

export const projectTourSteps: DriveStep[] = [
  {
    popover: {
      title: stepTranslations[0],
      description: stepTranslations[1],
      showButtons: ['next'],
    },
  },
  {
    element: '#nav-project-info',
    popover: {
      description: `${i18next.t('projects.tour.project_info_review')}`,
    },
  },
  {
    element: '#nav-users',
    popover: {
      description: `${i18next.t('projects.tour.users_review')}`,
    },
  },
  {
    element: '#nav-data-sharing',
    popover: {
      description: `${i18next.t('projects.tour.data_sharing_review')}`,
    },
  },
  {
    element: '#nav-sites',
    popover: {
      description: `${i18next.t('projects.tour.sites_review')}`,
    },
  },
  {
    element: '#nav-management-regimes',
    popover: {
      description: `${i18next.t('projects.tour.management_regimes_review')}`,
    },
  },
  {
    element: '#nav-collecting',
    popover: {
      description: `${i18next.t('projects.tour.collecting_review')}`,
    },
  },
  {
    element: '#nav-submitted',
    popover: {
      description: `${i18next.t('projects.tour.submitted_review')}`,
    },
  },
  {
    element: '#nav-observers-overview',
    popover: {
      description: `${i18next.t('projects.tour.observers_overview_review')}`,
    },
  },
  {
    element: '#nav-samples-mr-overview',
    popover: {
      description: `${i18next.t('projects.tour.samples_management_review')}`,
    },
  },
  {
    popover: {
      title: `${i18next.t('projects.tour.outro_tagline')}`,
      description: `${i18next.t('projects.tour.outro')}`,
    },
  },
]
