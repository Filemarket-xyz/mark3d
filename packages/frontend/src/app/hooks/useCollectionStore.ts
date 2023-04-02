import { useStores } from './useStores'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing collection details
 * @param collectionAddress
 */
export function useCollectionStore(collectionAddress?: string) {
  const { collectionStore } = useStores()
  useActivateDeactivateRequireParams(collectionStore, collectionAddress)
  return collectionStore
}
