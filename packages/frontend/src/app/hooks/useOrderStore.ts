import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains active order state and status fields like isLoading, isLoaded
 * @param collectionAddress
 * @param tokenId
 */
export function useOrderStore(collectionAddress?: string, tokenId?: string) {
  const { orderStore } = useStores()
  useActivateDeactivateRequireParams(orderStore, collectionAddress, tokenId)

  return orderStore
}
