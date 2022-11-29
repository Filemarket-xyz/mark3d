import { useAccount, useSigner } from 'wagmi'
import { useCallback } from 'react'
import lighthouse from '@lighthouse-web3/sdk'
import { assertSigner } from '../utils/assert'
import assert from 'assert'
import { lighthouseService } from '../../services/LighthouseService'
import { ERC721TokenMetaInput } from '../types'

export function useUploadLighthouse() {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  return useCallback(async (meta: ERC721TokenMetaInput) => {
    assertSigner(signer)
    assert(address, 'user is not connected')
    const getAccessToken = async () => {
      const message = await lighthouseService.getMessage(address)
      const signedMessage = await signer.signMessage(message) // Sign message
      return await lighthouseService.getAccessToken(address, signedMessage)
    }

    const accessToken = await getAccessToken()

    const uploadFile = async (file: File) => {
      const output = await lighthouse.upload({ target: { files: [file] }, persist: () => void 0 }, accessToken)

      return {
        url: `ipfs://${output.Hash}/${output.Name}`,
        cid: output.Hash
      }
    }

    // Key - property name, that contained files. Value - URI of the uploaded file
    const fileProps: Record<string, string> = Object.create(null)

    for (const key of Object.keys(meta)) {
      // @ts-expect-error
      const value: any = meta[key]
      if (value instanceof File) {
        const fileUploaded = await uploadFile(value)
        fileProps[key] = fileUploaded.url
      }
    }

    const metaToUpload = JSON.stringify({
      ...meta,
      ...fileProps
    }, undefined, 2)

    const metaFile = new File([metaToUpload], 'metadata.json', { type: 'text/plain' })

    return await uploadFile(metaFile)
  }, [signer, address])
}
