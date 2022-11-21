import { useEffect } from 'react'
import { useStores } from './useStores'
import { CollectionAndTokenListStore } from '../stores/CollectionAndTokenList/CollectionAndTokenListStore'

/**
 * Component, using this hook, MUST be wrapped into observer
 * Returned store contains fields with collections, tokens and status fields like isLoading, isLoaded
 * @param address
 */
export function useCollectionAndTokenListStore(address?: string): CollectionAndTokenListStore {
  const { collectionAndTokenList } = useStores()
  useEffect(() => {
    if (address) {
      collectionAndTokenList.activate(address)
    }
    return () => collectionAndTokenList.deactivate()
  }, [address])
  return collectionAndTokenList
}
