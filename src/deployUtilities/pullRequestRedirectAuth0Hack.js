/*
* Only runs for preview.app2.datamermaid.org, where we append the pull request number to the url to display a preview of that PR.
* Auth0 doesn't allow us to use wildcards in the path for a callback url (ex. preview.app2.datamermaid.org/*),
  so we must add the pull request number back into the url after being authenticated in order to be sent to the correct app
  (ex. preview.app2.datamermaid.org/<pr_number_here>/index.html)
* There is a script at preview.app2.datamermaid.org that runs when coming back from auth0 which grabs the PR number stored in
  localStorage, builds the correct url (ex. preview.app2.datamermaid.org/<pr_number_here>/index.html?state=foobarbaz), and re-directs the user to it.
* We must set the PR number in localStorage before being sent to auth0, so that it is available to preview.app2.datamermaid.org when we come back.
*/

const pullRequestRedirectAuth0Hack = () => {
  if (window.location.origin.includes('preview')) {
    const indexHtmlPath = window.location.href.indexOf('index.html')

    const redirectUrl =
      indexHtmlPath === -1
        ? window.Location.href
        : window.location.href.slice(0, window.location.href.indexOf('index.html')) // remove the preview/index.html CI hack from the url

    localStorage.setItem('authORedirectUrl', redirectUrl)
  }
}

export default pullRequestRedirectAuth0Hack
