import { expect, test } from 'vitest'
import getSelectableAttributes, { PROPOSED_ATTRIBUTE_STATUS } from './getSelectableAttributes'

const currentUserProfileId = 'current-user-profile-id'
const otherUserProfileId = 'other-user-profile-id'

const approvedAttribute = {
  id: 'approved',
  status: 90,
  created_by: null,
}
const currentUsersProposedAttribute = {
  id: 'own-proposed',
  status: PROPOSED_ATTRIBUTE_STATUS,
  created_by: currentUserProfileId,
}
const otherUsersProposedAttribute = {
  id: 'other-users-proposed',
  status: PROPOSED_ATTRIBUTE_STATUS,
  created_by: otherUserProfileId,
}
// locally created proposals (see eg addInvertSpecies) have no status or created_by
const localNotYetPushedProposedAttribute = {
  id: 'local-proposed',
  status: undefined,
  uiState_pushToApi: true,
}

test('getSelectableAttributes keeps approved attributes regardless of who created them', () => {
  expect(getSelectableAttributes([approvedAttribute], currentUserProfileId)).toEqual([
    approvedAttribute,
  ])
})

test('getSelectableAttributes keeps proposed attributes created by the current user', () => {
  expect(getSelectableAttributes([currentUsersProposedAttribute], currentUserProfileId)).toEqual([
    currentUsersProposedAttribute,
  ])
})

test('getSelectableAttributes removes proposed attributes created by other users', () => {
  expect(getSelectableAttributes([otherUsersProposedAttribute], currentUserProfileId)).toEqual([])
})

test('getSelectableAttributes keeps locally proposed attributes that have not been pushed to the API yet', () => {
  expect(
    getSelectableAttributes([localNotYetPushedProposedAttribute], currentUserProfileId),
  ).toEqual([localNotYetPushedProposedAttribute])
})

test('getSelectableAttributes handles a mixed list', () => {
  expect(
    getSelectableAttributes(
      [
        approvedAttribute,
        currentUsersProposedAttribute,
        otherUsersProposedAttribute,
        localNotYetPushedProposedAttribute,
      ],
      currentUserProfileId,
    ),
  ).toEqual([approvedAttribute, currentUsersProposedAttribute, localNotYetPushedProposedAttribute])
})
