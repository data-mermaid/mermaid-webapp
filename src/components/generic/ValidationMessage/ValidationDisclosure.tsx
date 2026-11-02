import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Which field or row has its collapsed validation messages open. Only one is open at a time
// across the form, so opening one closes the last. Keys name a field (`field:<validationPath>`)
// or an observation row (`row:<observationId>`).
export interface ValidationDisclosureStore {
  openKey: string | null
  open: (key: string) => void
  close: () => void
  toggle: (key: string) => void
}

const ValidationDisclosureContext = createContext<ValidationDisclosureStore | null>(null)

// Owned by the page rather than by the provider, so the page's own hooks (such as the one
// behind the Next button) can open and close the same field or row the user toggles.
export const useValidationDisclosureStore = (): ValidationDisclosureStore => {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const open = useCallback((key: string) => setOpenKey(key), [])
  const close = useCallback(() => setOpenKey(null), [])
  const toggle = useCallback(
    (key: string) => setOpenKey((current) => (current === key ? null : key)),
    [],
  )

  return useMemo(() => ({ openKey, open, close, toggle }), [openKey, open, close, toggle])
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
    return { canCollapse: false, isOpen: true, toggle: () => {} }
  }

  return {
    canCollapse: true,
    isOpen: store.openKey === key,
    toggle: () => store.toggle(key),
  }
}
