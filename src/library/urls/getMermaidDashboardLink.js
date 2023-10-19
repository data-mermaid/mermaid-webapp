import { isLocalHost } from './isLocalHost'

export const getMermaidDashboardLink = () => {
  const isDevApp = window.location.host.split('.')[0] === 'dev-app'
  const mermaidDashboardLink =
    isLocalHost() || isDevApp
      ? process.env.REACT_APP_MERMAID_DEV_DASHBOARD_LINK
      : process.env.REACT_APP_MERMAID_DASHBOARD_LINK

  return mermaidDashboardLink
}
