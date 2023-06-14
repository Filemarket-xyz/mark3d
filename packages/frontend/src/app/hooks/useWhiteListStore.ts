import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing info about whitelist
 * @param address
 */
export function useWhiteListStore(address?: `0x${string}`) {
  const { whitelistStore } = useStores()
  useActivateDeactivateRequireParams(whitelistStore, address)

  return whitelistStore
}
