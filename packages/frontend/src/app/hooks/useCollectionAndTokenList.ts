import { CollectionAndTokenListStore } from '../stores/CollectionAndTokenList/CollectionAndTokenListStore'
import { useActivateDeactivateRequireParams } from './useActivateDeactivateStore'
import { useStores } from './useStores'

/**
 * Component, using this hook, MUST be wrapped into observer
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param address
 */
export function useCollectionAndTokenListStore(address?: string): CollectionAndTokenListStore {
  const { collectionAndTokenList } = useStores()
  useActivateDeactivateRequireParams(collectionAndTokenList, address)

  return collectionAndTokenList
}
