import { getCurrentUserOptionalFeature } from './getCurrentUserOptionalFeature'

export const useExploreLaunchFeature = ({ currentUser }) => {
  const { enabled: isExploreLaunchEnabledForUser = false } = getCurrentUserOptionalFeature(
    currentUser,
    'explore_launch',
  )

  const mermaidExploreLink = isExploreLaunchEnabledForUser
    ? import.meta.env.VITE_MERMAID_DASHBOARD_LINK
    : `https://dev-dashboard.datamermaid.org`

  return {
    mermaidExploreLink,
    isExploreLaunchEnabledForUser,
  }
}
