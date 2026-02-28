import { driver, DriveStep } from 'driver.js'
import type { TFunction } from 'i18next'
import i18n from '../../i18n'

export function buildProjectTourSteps(t: TFunction): DriveStep[] {
  return [
    {
      popover: {
        title: t('projects.tour.intro_tagline'),
        description: t('projects.tour.intro'),
        showButtons: ['next'],
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleTourClose = (_element, _step, { state, driver }) => {
  const isTourComplete = driver.isLastStep()
  const eventName = isTourComplete
    ? 'demo_tour_completed'
    : `demo_tour_close_step_${driver.getActiveIndex() + 1}`
  // @ts-expect-error - dataLayer instantiated before GTM
  window.dataLayer.push({
    event: eventName,
  })
  driver.destroy()
}

export const startProjectTour = () => {
  const driverTourObj = driver({
    showProgress: true,
    nextBtnText: '→',
    prevBtnText: '←',
    progressText: i18n.t('projects.tour.tour_steps'), //driverJS auto passes current and total
    onPopoverRender: (popover) => {
      popover.arrow.remove()
    },
    steps: buildProjectTourSteps(i18n.t),
    onDestroyStarted: handleTourClose,
  })
  driverTourObj.drive()
}
