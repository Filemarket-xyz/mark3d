import { IRarityWl } from '../stores/FileBunnies/FileBunniesTokenStore'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer.
 * Supports repeated usage in nested components.
 * Returns store containing info about whitelist
 * @param address
 * @param rarityWl
 */
export function useFileBunniesTokenStore(address?: `0x${string}`, rarityWl?: IRarityWl) {
  const { fileBunniesTokenStore } = useStores()
  useActivateDeactivateRequireParams(fileBunniesTokenStore, address, rarityWl)

  return fileBunniesTokenStore
}
