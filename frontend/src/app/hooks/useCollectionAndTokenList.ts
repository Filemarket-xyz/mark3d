import { useEffect } from 'react'
import { useStores } from './useStores'
import { CollectionAndTokenList } from '../stores/CollectionAndTokenList/CollectionAndTokenListStore'

// You can eiter use collections field or tokens field, or both
export function useCollectionAndTokenListStore(address?: string): CollectionAndTokenList {
  const { collectionAndTokenList } = useStores()
  useEffect(() => {
    if (address) {
      collectionAndTokenList.activate(address)
    }
    return () => collectionAndTokenList.deactivate()
  }, [address])
  return collectionAndTokenList
}