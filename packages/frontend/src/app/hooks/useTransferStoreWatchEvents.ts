import { useTransferStore } from './useTransferStore'
import { useWatchHiddenFileTokenEvents } from '../processing'

export function useTransferStoreWatchEvents(collectionAddress?: string, tokenId?: string) {
  const transferStore = useTransferStore(collectionAddress, tokenId)
  useWatchHiddenFileTokenEvents(transferStore, collectionAddress)
  return transferStore
}
