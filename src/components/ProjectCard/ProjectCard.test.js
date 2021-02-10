import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { renderAuthenticated } from '../../testUtilities/testingLibraryWithHelpers'

import ProjectCard from './ProjectCard'

test('ProjectCard component renders with the expected UI elements', () => {
  const utilities = renderAuthenticated(<ProjectCard />)

  expect(utilities.getByText('I should fail'))
})
