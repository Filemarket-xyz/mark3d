import { useStores } from './useStores'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing data field with collection's tokens, and status fields like isLoading, isLoaded
 * @param profileAddress
 */
export function useTransfersHistory(profileAddress?: string) {
  const { transfersHistoryStore } = useStores()
  useActivateDeactivateRequireParams(transfersHistoryStore, profileAddress)
  return transfersHistoryStore
}
