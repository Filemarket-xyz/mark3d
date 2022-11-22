
import { useStores } from './useStores'
import { useActivateDeactivateAddress } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param address
 */
export function useTransferListStore(address?: string) {
  const { transferListStore } = useStores()
  useActivateDeactivateAddress(transferListStore, address)
  return transferListStore
}
