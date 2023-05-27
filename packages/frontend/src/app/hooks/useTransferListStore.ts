
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param address
 */
export function useTransferListStore(address?: string) {
  const { transferListStore } = useStores()
  useActivateDeactivateRequireParams(transferListStore, address)

  return transferListStore
}
