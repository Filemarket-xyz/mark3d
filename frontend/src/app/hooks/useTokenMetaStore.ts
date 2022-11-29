import { useStores } from './useStores'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'

/**
 * Component, using this function, MUST be wrapped into observer
 */
export function useTokenMetaStore(metaURI?: string) {
  const { tokenMetaStore } = useStores()
  useActivateDeactivateRequireParams(tokenMetaStore, metaURI)
  return tokenMetaStore
}
