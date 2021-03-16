/* 
* Only runs for preview.datamermaid.org, where we append the pull request number to the url to display a preview of that PR.
* Auth0 doesn't allow us to use wildcards in the path for a callback url (ex. preview.datamermaid.org/*),
  so we must add the pull request number back into the url after being authenticated in order to be sent to the correct app
  (ex. preview.datamermaid.org/<pr_number_here>)
* There is a script at preview.datamermaid.org that runs when coming back from auth0 which grabs the PR number stored in
  localStorage, builds the correct url (ex. preview.datamermaid.org/<pr_number_here>/?state=foobarbaz), and re-directs the user to it.
* We must set the PR number in localStorage before being sent to auth0, so that it is available to preview.datamermaid.org when we come back.
*/ 

const pullRequestRedirectAuth0Hack = () => {
  if (window.location.origin.includes('preview')) {
    localStorage.setItem('pullRequestNumber', process.env.PUBLIC_URL)
  }
}

export default pullRequestRedirectAuth0Hack
