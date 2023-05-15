/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { utils } from 'ethers'
import { saveAs } from 'file-saver'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Token } from '../../swagger/Api'
import { useHiddenFileProcessorFactory } from '../processing'
import { DecryptResult } from '../processing/types'
import { ipfsService } from '../services/IPFSService'
import { ErrorStore } from '../stores/Error/ErrorStore'
import { TokenMetaStore } from '../stores/Token/TokenMetaStore'
import { getIpfsCidWithFilePath } from '../utils/nfts/getHttpLinkFromIpfsString'

export interface HiddenFileDownload {
  cid: string
  name: string
  size: number
  download: () => Promise<boolean | void>
  getFile: () => Promise<DecryptResult<File>>
}

// массив, потому что в будущем предполагается прикрепление нескольких скрытых файлов
export function useHiddenFileDownload(
  tokenMetaStore: TokenMetaStore, errorStore: ErrorStore, token?: Token
): HiddenFileDownload[] {
  const factory = useHiddenFileProcessorFactory()
  const { address } = useAccount()
  const { meta } = tokenMetaStore

  return useMemo(() => {
    if (!factory || !token || !token.collectionAddress || !token.tokenId || !address || !meta?.hidden_file) {
      return []
    }

    const hiddenFileURI = meta.hidden_file
    const hiddenMeta = meta.hidden_file_meta
    const collectionAddress = utils.getAddress(token.collectionAddress)
    const tokenId = +token.tokenId

    return [{
      cid: getIpfsCidWithFilePath(hiddenFileURI),
      name: hiddenMeta?.name || hiddenFileURI,
      size: hiddenMeta?.size || 0,
      download: async () => {
        const encryptedFile = await ipfsService.fetchBytes(hiddenFileURI)
        const owner = await factory.getOwner(address, collectionAddress, tokenId)
        const file = await owner.decryptFile(encryptedFile, hiddenMeta)
        if (file.ok) {
          saveAs(file.result, file.result.name)
          return file.ok
        }

        errorStore.showError(file.error)
      },
      getFile: async () => {
        const encryptedFile = await ipfsService.fetchBytes(hiddenFileURI)
        const owner = await factory.getOwner(address, collectionAddress, tokenId)
        return owner.decryptFile(encryptedFile, hiddenMeta)
      }
    }]
  }, [factory, token, address, meta])
}
