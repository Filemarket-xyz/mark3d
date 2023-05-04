import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains token state and status fields like isLoading, isLoaded
 * @param collectionAddress
 * @param tokenId
 */
export function useUserTransferStore(address?: string) {
  const { userTransferStore } = useStores()
  useActivateDeactivateRequireParams(userTransferStore, address)
  return userTransferStore
}
