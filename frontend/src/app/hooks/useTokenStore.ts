import { useStores } from './useStores'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains token state and status fields like isLoading, isLoaded
 * @param collectionAddress
 * @param tokenId
 */
export function useTokenStore(collectionAddress?: string, tokenId?: string) {
  const { tokenStore } = useStores()
  useActivateDeactivateRequireParams(tokenStore, collectionAddress, tokenId)
  return tokenStore
}
