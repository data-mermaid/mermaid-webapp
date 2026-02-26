import { DriveStep } from 'driver.js'
import type { TFunction } from 'i18next'

export function buildProjectTourSteps(t: TFunction): DriveStep[] {
  return [
    {
      popover: {
        title: t('projects.tour.intro_tagline'),
        description: t('projects.tour.intro'),
        showButtons: ['next', 'close'],
      },
    },
    {
      element: '#nav-project-info',
      popover: {
        align: 'center',
        description: t('projects.tour.project_info_review'),
      },
    },
    {
      element: '#nav-users',
      popover: {
        align: 'center',
        description: t('projects.tour.users_review'),
      },
    },
    {
      element: '#nav-data-sharing',
      popover: {
        align: 'end',
        description: t('projects.tour.data_sharing_review'),
      },
    },
    {
      element: '#nav-sites',
      popover: {
        align: 'center',
        description: t('projects.tour.sites_review'),
      },
    },
    {
      element: '#nav-management-regimes',
      popover: {
        align: 'center',
        description: t('projects.tour.management_regimes_review'),
      },
    },
    {
      element: '#nav-collecting',
      popover: {
        align: 'center',
        description: t('projects.tour.collecting_review'),
      },
    },
    {
      element: '#nav-submitted',
      popover: {
        align: 'center',
        description: t('projects.tour.submitted_review'),
      },
    },
    {
      element: '#nav-observers-overview',
      popover: {
        align: 'center',
        description: t('projects.tour.observers_overview_review'),
      },
    },
    {
      element: '#nav-samples-mr-overview',
      popover: {
        align: 'center',
        description: t('projects.tour.samples_management_review'),
      },
    },
    {
      popover: {
        title: t('projects.tour.outro_tagline'),
        description: t('projects.tour.outro'),
      },
    },
  ]
}
