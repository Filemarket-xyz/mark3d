/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { utils } from 'ethers'
import { saveAs } from 'file-saver'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { str2ab } from '../../../../crypto/src/lib/utils'
import { Token } from '../../swagger/Api'
import { globalSaltMock, useHiddenFileProcessorFactory } from '../processing'
import { useSeed } from '../processing/SeedProvider/useSeed'
import { DecryptResult, TokenFullId } from '../processing/types'
import { ipfsService } from '../services/IPFSService'
import { ErrorStore } from '../stores/Error/ErrorStore'
import { TokenMetaStore } from '../stores/Token/TokenMetaStore'
import { getIpfsCidWithFilePath } from '../utils/nfts/getHttpLinkFromIpfsString'

export interface HiddenFileDownload {
  cid: string
  name: string
  size: number
  download: () => void
  getFile: () => Promise<DecryptResult<File>>
}

// массив, потому что в будущем предполагается прикрепление нескольких скрытых файлов
export function useHiddenFileDownload(
  tokenMetaStore: TokenMetaStore, errorStore: ErrorStore, token?: Token
): HiddenFileDownload[] {
  const factory = useHiddenFileProcessorFactory()
  const { address } = useAccount()
  const seed = useSeed(address)
  const { meta } = tokenMetaStore

  return useMemo(() => {
    if (factory && token && token.collectionAddress && token.tokenId && address && meta?.hidden_file && seed) {
      const hiddenFileURI = meta.hidden_file
      const hiddenMeta = meta.hidden_file_meta
      const tokenFullId: TokenFullId = {
        collectionAddress: utils.getAddress(token.collectionAddress),
        tokenId: token.tokenId
      }
      const collectionAddressArrayBuffer = str2ab(tokenFullId.collectionAddress)

      return [{
        cid: getIpfsCidWithFilePath(hiddenFileURI),
        name: hiddenMeta?.name || hiddenFileURI,
        size: hiddenMeta?.size || 0,
        download: async () => {
          const encryptedFile = await ipfsService.fetchBytes(hiddenFileURI)
          const owner = await factory.getOwner(address, tokenFullId)
          const file = await owner.decryptFile(
            encryptedFile,
            hiddenMeta,
            seed,
            globalSaltMock,
            collectionAddressArrayBuffer,
            +tokenFullId.tokenId
          )
          if (file.ok) {
            saveAs(file.result, file.result.name)
          } else {
            errorStore.showError(file.error)
          }
        },
        getFile: async () => {
          const encryptedFile = await ipfsService.fetchBytes(hiddenFileURI)
          const owner = await factory.getOwner(address, tokenFullId)
          return owner.decryptFile(
            encryptedFile,
            hiddenMeta,
            seed,
            globalSaltMock,
            collectionAddressArrayBuffer,
            +tokenFullId.tokenId
          )
        }
      }]
    }
    return []
  }, [factory, token, address, meta])
}
