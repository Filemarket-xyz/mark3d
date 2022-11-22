import { useStores } from './useStores'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param address
 * @param tokenId
 */
export function useTransferStore(address?: string, tokenId?: string) {
  const { transferStore } = useStores()
  useActivateDeactivateRequireParams(transferStore, address, tokenId)
  return transferStore
}
