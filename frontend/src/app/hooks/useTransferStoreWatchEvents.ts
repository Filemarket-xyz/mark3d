import { useTransferStore } from './useTransferStore'
import { useWatchHiddenFileTokenEvents } from '../processing/hooks/useWatchHiddenFileTokenEvents'

export function useTransferStoreWatchEvents(collectionAddress?: string, tokenId?: string) {
  const transferStore = useTransferStore(collectionAddress, tokenId)
  useWatchHiddenFileTokenEvents(transferStore, collectionAddress)
  return transferStore
}
