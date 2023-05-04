import { useWatchHiddenFileTokenEvents } from '../processing'
import { useTransferStore } from './useTransferStore'

export function useTransferStoreWatchEvents(collectionAddress?: string, tokenId?: string) {
  const transferStore = useTransferStore(collectionAddress, tokenId)
  useWatchHiddenFileTokenEvents(transferStore, collectionAddress)
  return transferStore
}
