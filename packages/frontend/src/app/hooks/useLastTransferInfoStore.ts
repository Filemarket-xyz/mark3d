import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains token state and status fields like isLoading, isLoaded
 * @param collectionAddress
 * @param tokenId
 */
export function useLastTransferInfoStore(collectionAddress?: string, tokenId?: string) {
  const { lastTransferInfoStore } = useStores()
  useActivateDeactivateRequireParams(lastTransferInfoStore, collectionAddress, tokenId)
  return lastTransferInfoStore
}
