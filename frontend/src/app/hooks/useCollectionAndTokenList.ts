import { useStores } from './useStores'
import { CollectionAndTokenListStore } from '../stores/CollectionAndTokenList/CollectionAndTokenListStore'
import { useActivateDeactivateAddress } from './useActivateDeactivateStore'

/**
 * Component, using this hook, MUST be wrapped into observer
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param address
 */
export function useCollectionAndTokenListStore(address?: string): CollectionAndTokenListStore {
  const { collectionAndTokenList } = useStores()
  useActivateDeactivateAddress(collectionAndTokenList, address)
  return collectionAndTokenList
}
