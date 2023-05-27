import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this function, MUST be wrapped into observer
 */
export function useTokenMetaStore(metaURI?: string) {
  const { tokenMetaStore } = useStores()
  useActivateDeactivateRequireParams(tokenMetaStore, metaURI)

  return tokenMetaStore
}
