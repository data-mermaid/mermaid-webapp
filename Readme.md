# Mermaid Webapp

## Steps to Set Up Development Environment

1. Set up a local Mermaid back end
   1. Clone https://github.com/data-mermaid/mermaid-api
   1. To get the server up and running, run `make freshinstall && make runserver` the first time or `make up && make runserver`
1. Set up local front end
   1. clone this repo
   1. obtain values for `.env` file (see `.env.sample`)
   1. yarn install
   1. yarn start

## Dev Notes

1. `plop <filename>` scaffolds component files inside the `src/components` directory
1. `src/components/generic` are be for reusable components that may be useful for other projects. They should be developed to be completely unaware of their context. Make them 'dumb' (employ inversion of control).
1. `src/components/pages` are for pages or page-like components
1. Styles will be done with Styled Components for easy scoping, speed, and maintainability. Make sure to import using the macro for easier debugging (it results in more human-friendly classnames) `import styled from 'styled-components/macro'`
1. Focus on integration tests, and testing complex pieces of code.

## Manual Testing

- Offline (PWA) apps are not created with the Create React App development server. To test offline functionality, you need to build and serve the built code. `yarn build && serve -s build`.

## Deploying

### Pull Request Previews
- Available at `preview.datamermaid.org/<pull-request-number-here>/`
- A preview of the application is created when a pull request is opened, sychronized (commit is made), or re-opened.
- A bot will add a PR comment with the link to the preview, once it is ready.
- Once a pull request is merged or closed, the respective preview will be deleted.

### Develop (non-prod)
- Available at [dev-app.datamermaid.org](https://dev-app.datamermaid.org)
- Is updated any time someone pushes to the `develop` branch

### Production
- Available at [app.datamermaid.org](https://app.datamermaid.org)
- Is updated on tag creation
