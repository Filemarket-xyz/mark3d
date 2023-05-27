import lighthouse from '@lighthouse-web3/sdk'
import { useCallback } from 'react'
import { useAccount, useSigner } from 'wagmi'

import { lighthouseService } from '../../services/LighthouseService'
import { ERC721TokenMetaInput } from '../types'
import { assertAccount, assertSigner } from '../utils/assert'

export function useUploadLighthouse() {
  const { data: signer } = useSigner()
  const { address } = useAccount()

  return useCallback(async (meta: ERC721TokenMetaInput) => {
    assertSigner(signer)
    assertAccount(address)

    const getAccessToken = async () => {
      const message = await lighthouseService.getMessage(address)
      const signedMessage = await signer.signMessage(message) // Sign message

      return lighthouseService.getAccessToken(address, signedMessage)
    }

    const accessToken = await getAccessToken()

    const uploadFile = async (fileOrBlob: File | Blob) => {
      let file: File
      if (fileOrBlob instanceof Blob && !(fileOrBlob instanceof File)) {
        file = new File([fileOrBlob], 'file')
      } else {
        file = fileOrBlob
      }
      const output = await lighthouse.upload(
        { target: { files: [file] }, persist: () => void 0 },
        accessToken, () => void 0,
      )

      return {
        url: `ipfs://${output.data.Hash}`,
        cid: output.data.Hash,
      }
    }

    // Key - property name, that contained files. Value - URI of the uploaded file
    const fileProps: Record<string, string> = Object.create(null)

    for (const key of Object.keys(meta)) {
      // @ts-expect-error
      const value: any = meta[key]
      if (value instanceof Blob) {
        const fileUploaded = await uploadFile(value)
        fileProps[key] = fileUploaded.url
      }
    }

    const metaToUpload = JSON.stringify({
      ...meta,
      ...fileProps,
    }, undefined, 2)

    const metaFile = new File([metaToUpload], 'metadata.json', { type: 'text/plain' })

    return uploadFile(metaFile)
  }, [signer, address])
}
