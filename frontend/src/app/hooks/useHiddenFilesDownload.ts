import { Token } from '../../swagger/Api'
import { TokenFullId } from '../processing/types'
import { useHiddenFileProcessorFactory } from '../processing/hooks'
import { useMemo } from 'react'
import { utils } from 'ethers'
import { useAccount } from 'wagmi'
import { ipfsService } from '../services/IPFSService'
import { saveAs } from 'file-saver'
import { TokenMetaStore } from '../stores/Token/TokenMetaStore'
import { ErrorStore } from '../stores/Error/ErrorStore'
import { getIpfsCidWithFilePath } from '../utils/nfts/getHttpLinkFromIpfsString'

export interface HiddenFileDownload {
  cid: string
  name: string
  size: number
  download: () => void
}

// массив, потому что в будущем предполагается прикрепление нескольких скрытых файлов
export function useHiddenFileDownload(
  tokenMetaStore: TokenMetaStore, errorStore: ErrorStore, token?: Token
): HiddenFileDownload[] {
  const factory = useHiddenFileProcessorFactory()
  const { address } = useAccount()
  const { meta } = tokenMetaStore
  return useMemo(() => {
    if (factory && token && token.collection && token.tokenId && address && meta?.hidden_file) {
      const hiddenFileURI = meta.hidden_file
      const hiddenMeta = meta.hidden_file_meta
      const tokenFullId: TokenFullId = {
        collectionAddress: utils.getAddress(token.collection),
        tokenId: token.tokenId
      }
      return [{
        cid: getIpfsCidWithFilePath(hiddenFileURI),
        name: hiddenMeta?.name || hiddenFileURI,
        size: hiddenMeta?.size || 0,
        download: async () => {
          const encryptedFile = await ipfsService.fetchBytes(hiddenFileURI)
          const owner = await factory.getOwner(address, tokenFullId)
          const file = await owner.decryptFile(encryptedFile, hiddenMeta)
          if (file.ok) {
            saveAs(file.result, file.result.name)
          } else {
            errorStore.showError(file.error)
          }
        }
      }]
    }
    return []
  }, [factory, token, address, meta])
}
