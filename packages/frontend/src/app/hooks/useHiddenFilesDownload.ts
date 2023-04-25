/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { utils } from 'ethers'
import { saveAs } from 'file-saver'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { Token } from '../../swagger/Api'
import { globalSaltMock, hexToBuffer, useHiddenFileProcessorFactory } from '../processing'
import { DecryptResult, TokenFullId } from '../processing/types'
import { ipfsService } from '../services/IPFSService'
import { ErrorStore } from '../stores/Error/ErrorStore'
import { TokenMetaStore } from '../stores/Token/TokenMetaStore'
import { getIpfsCidWithFilePath } from '../utils/nfts/getHttpLinkFromIpfsString'
import { useLastTransferInfo } from './useLastTransferInfo'

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
  const { meta } = tokenMetaStore
  const { encryptedPassword, dealNumber } = useLastTransferInfo(token?.collection, token?.tokenId)

  return useMemo(() => {
    if (!factory || !token || !token.collection || !token.tokenId || !address || !meta?.hidden_file) {
      return []
    }

    const hiddenFileURI = meta.hidden_file
    const hiddenMeta = meta.hidden_file_meta
    const tokenFullId: TokenFullId = {
      collectionAddress: utils.getAddress(token.collection),
      tokenId: token.tokenId
    }
    const collectionAddressBuffer = hexToBuffer(tokenFullId.collectionAddress)

    return [{
      cid: getIpfsCidWithFilePath(hiddenFileURI),
      name: hiddenMeta?.name || hiddenFileURI,
      size: hiddenMeta?.size || 0,
      download: async () => {
        const encryptedFile = await ipfsService.fetchBytes(hiddenFileURI)
        const owner = await factory.getOwner(address)
        const file = await owner.decryptFile(
          encryptedFile,
          hiddenMeta,
          encryptedPassword,
          dealNumber,
          globalSaltMock,
          collectionAddressBuffer,
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
        const owner = await factory.getOwner(address)
        return owner.decryptFile(
          encryptedFile,
          hiddenMeta,
          encryptedPassword,
          dealNumber,
          globalSaltMock,
          collectionAddressBuffer,
          +tokenFullId.tokenId
        )
      }
    }]
  }, [factory, token, address, meta, encryptedPassword, dealNumber])
}
