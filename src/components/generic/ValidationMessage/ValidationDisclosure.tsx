import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Which fields and rows have their collapsed validation messages open. Two things open one: the
// diver, one at a time, and the Next button, which opens what it lands on and closes it when it
// moves on. A field or row the diver opened stays open when Next moves.
export interface ValidationDisclosureStore {
  isOpen: (key: string) => boolean
  open: (key: string) => void
  toggle: (key: string) => void
  openForNext: (key: string | null) => void
}

export const fieldDisclosureKey = (validationPath: string) => `field:${validationPath}`
export const rowDisclosureKey = (observationId: string) => `row:${observationId}`

interface OpenKeys {
  byHand: string | null
  byNext: string | null
}

const ValidationDisclosureContext = createContext<ValidationDisclosureStore | null>(null)

// Owned by the page rather than by the provider, so the page's own hooks (such as the one
// behind the Next button) can open and close the same field or row the user toggles.
export const useValidationDisclosureStore = (): ValidationDisclosureStore => {
  const [openKeys, setOpenKeys] = useState<OpenKeys>({ byHand: null, byNext: null })

  const isOpen = useCallback(
    (key: string) => key === openKeys.byHand || key === openKeys.byNext,
    [openKeys],
  )
  // Returning the current keys when nothing changes lets React skip the render.
  const open = useCallback(
    (key: string) =>
      setOpenKeys((current) => (current.byHand === key ? current : { ...current, byHand: key })),
    [],
  )
  const openForNext = useCallback(
    (key: string | null) =>
      setOpenKeys((current) => (current.byNext === key ? current : { ...current, byNext: key })),
    [],
  )
  // Hide closes the group whichever way it was opened.
  const toggle = useCallback(
    (key: string) =>
      setOpenKeys(({ byHand, byNext }) =>
        key === byHand || key === byNext
          ? { byHand: byHand === key ? null : byHand, byNext: byNext === key ? null : byNext }
          : { byHand: key, byNext },
      ),
    [],
  )

  return useMemo(() => ({ isOpen, open, toggle, openForNext }), [isOpen, open, toggle, openForNext])
}

export const ValidationDisclosureProvider = ({
  store,
  children,
}: {
  store: ValidationDisclosureStore
  children: React.ReactNode
}) => (
  <ValidationDisclosureContext.Provider value={store}>
    {children}
  </ValidationDisclosureContext.Provider>
)

// Outside a provider (site, management regime and GFCR forms) messages never collapse.
export const useValidationDisclosure = (key: string | undefined) => {
  const store = useContext(ValidationDisclosureContext)

  if (!store || !key) {
    return { canCollapse: false, isOpen: true, open: () => {}, toggle: () => {} }
  }

  return {
    canCollapse: true,
    isOpen: store.isOpen(key),
    open: () => store.open(key),
    toggle: () => store.toggle(key),
  }
}
