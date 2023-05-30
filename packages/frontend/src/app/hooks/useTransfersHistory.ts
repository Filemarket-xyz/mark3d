import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing data field with collection's tokens, and status fields like isLoading, isLoaded
 * @param profileAddress
 */
export function useTransfersHistoryStore(profileAddress?: string) {
  const { transfersHistoryStore } = useStores()
  useActivateDeactivateRequireParams(transfersHistoryStore, profileAddress)

  return transfersHistoryStore
}
