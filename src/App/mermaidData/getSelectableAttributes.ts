// MERMAID attribute status codes are shared by benthic attributes, fish species,
// and macroinvertebrate attributes: 10 = proposed (pending review), 90 = approved.
export const PROPOSED_ATTRIBUTE_STATUS = 10

interface AttributeWithProposalInfo {
  status?: number | null
  created_by?: string | null
}

// Proposed attributes are only usable by the user who proposed them. The pull API
// enforces this, but attributes lazy-loaded by id for read-only display (see
// ensureAttributesLoaded) can add other users' proposed attributes to offline storage,
// so they must be excluded wherever the user can select an attribute for an observation.
// Locally proposed attributes that have not been pushed to the API yet have no status,
// so they are kept.
const getSelectableAttributes = <T extends AttributeWithProposalInfo>(
  attributes: T[],
  currentUserProfileId: string | undefined,
): T[] =>
  (attributes ?? []).filter(
    (attribute) =>
      attribute.status !== PROPOSED_ATTRIBUTE_STATUS ||
      attribute.created_by === currentUserProfileId,
  )

export default getSelectableAttributes
