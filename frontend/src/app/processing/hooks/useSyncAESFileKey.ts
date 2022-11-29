import { TokenFullId } from '../types'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { useEffect } from 'react'
import { useIsOwner } from './useIsOwner'
import { useAccount } from 'wagmi'

export function useSyncAESFileKey({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, AESKeyEncrypted?: string) {
  const factory = useHiddenFileProcessorFactory()
  const { address } = useAccount()
  const { isOwner } = useIsOwner({ collectionAddress, tokenId })
  useEffect(() => {
    if (!isOwner && address && AESKeyEncrypted && collectionAddress && tokenId) {
      const tokenFullId = { collectionAddress, tokenId }
      let key = AESKeyEncrypted
      factory
        .getBuyer(address, tokenFullId)
        .then(buyer => {
          if (key.startsWith('0x')) {
            key = key.slice(2)
          }
          buyer
            .saveFileAESKey(Buffer.from(key, 'hex'))
            .then(() => {
              console.log('aes file key synced', buyer.surrogateId)
            })
            .catch(error => {
              console.error('syncAESFileKey error: decrypt AES key error', error)
              throw error
            })
        })
        .catch(error => {
          console.error('syncAESFileKey: get owner error', error)
          throw error
        })
    }
  }, [factory, address, isOwner, collectionAddress, tokenId, AESKeyEncrypted])
}
