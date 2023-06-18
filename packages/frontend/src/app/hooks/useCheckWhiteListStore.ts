import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing whiteList info
 * @param address
 */
export function useCheckWhiteListStore(address?: `0x${string}`) {
  const { whitelistStore } = useStores()
  useActivateDeactivateRequireParams(whitelistStore, address)

  return whitelistStore
}
