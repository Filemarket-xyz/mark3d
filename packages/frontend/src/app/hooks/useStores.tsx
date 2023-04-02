import { createContext, PropsWithChildren, useContext } from 'react'
import { RootStore, rootStore } from '../stores/RootStore'

export const StoreContext = createContext<RootStore>(rootStore)

export function StoreProvider({
  children
// eslint-disable-next-line @typescript-eslint/ban-types
}: PropsWithChildren): JSX.Element {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  )
}

export function useStores(): RootStore {
  return useContext(StoreContext)
}
