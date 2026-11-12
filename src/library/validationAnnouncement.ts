import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { TFunction } from 'i18next'
import type { CurrentUser } from '../App/mermaidData/mermaidDataTypes'
import { links } from '../link_constants'

export const VALIDATION_COUNTS_BAR_ID = 'form-status-indicators'

// The day Validate began returning every error and warning at once. An account created from
// then on has no earlier way of validating to unlearn.
const RELEASE_DATE = new Date('2026-11-16T00:00:00Z')

const getSeenKey = (currentUser: CurrentUser) =>
  `validation-release-announcement-seen:${currentUser.id}`

const getHasSeen = (currentUser: CurrentUser) =>
  localStorage.getItem(getSeenKey(currentUser)) === 'true'

const markSeen = (currentUser: CurrentUser) => localStorage.setItem(getSeenKey(currentUser), 'true')

// An account with no created date can't be placed before the release, so it is left out.
export const getIsEligibleForValidationAnnouncement = (currentUser: CurrentUser) =>
  !!currentUser.created_on &&
  new Date(currentUser.created_on) < RELEASE_DATE &&
  !getHasSeen(currentUser)

// Points at the counts bar and returns a function that closes the announcement.
export const startValidationAnnouncement = (currentUser: CurrentUser, t: TFunction) => {
  // The person can leave the record while Validate runs, taking the bar with them.
  if (!document.getElementById(VALIDATION_COUNTS_BAR_ID)) {
    return undefined
  }

  const announcement = driver({
    doneBtnText: t('sample_units.validation_announcement.done'),
    onPopoverRender: (popover) => {
      popover.arrow.remove()

      const guideLink = document.createElement('a')
      guideLink.href = links.collectValidationGuide
      guideLink.target = '_blank'
      guideLink.rel = 'noopener noreferrer'
      guideLink.textContent = t('sample_units.validation_announcement.read_the_guide')
      popover.footer.prepend(guideLink)
    },
    // The page stays undimmed; the bar's outline marks it instead (see FormStatusIndicators).
    overlayOpacity: 0,
    // A stray click elsewhere must not use up the one showing.
    overlayClickBehavior: 'none',
    showButtons: ['next', 'close'],
    steps: [
      {
        element: `#${VALIDATION_COUNTS_BAR_ID}`,
        popover: {
          description: t('sample_units.validation_announcement.description'),
          side: 'bottom',
          title: t('sample_units.validation_announcement.title'),
        },
      },
    ],
  })

  announcement.drive()
  // Marked on opening, not closing: driver.js skips its closing hooks when closed mid-animation.
  markSeen(currentUser)

  return () => announcement.destroy()
}
