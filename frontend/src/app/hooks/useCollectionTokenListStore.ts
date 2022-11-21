import { useStores } from './useStores'
import { useActivateDeactivateAddress } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing data field with collection's tokens, and status fields like isLoading, isLoaded
 * @param collectionAddress
 */
export function useCollectionTokenListStore(collectionAddress?: string) {
  const { collectionTokenList } = useStores()
  useActivateDeactivateAddress(collectionTokenList, collectionAddress)
  return collectionTokenList
}
